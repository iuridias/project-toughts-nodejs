const Tought = require('../models/Tought');
const User = require('../models/User');

const { Op } = require('sequelize');

module.exports = class ToughtController {
  static async showToughts(req, res) {

    let search = '';

    if (req.query.search) {
      search = req.query.search;
    }

    let order = 'DESC';

    if(req.query.order === 'old') {
      order = 'ASC'
    } else {
      order = 'DESC'
    }

    const toughtsData = await Tought.findAll({
      include: User,
      where: {
        title: {[Op.like]: `%${search}%`}
      },
      order: [['createdAt', order]]
    });

    const toughts = toughtsData.map(result => result.get({plain: true}))

    let toughtsQty = toughts.length;

    if (toughtsQty === 0) {
      toughtsQty = false;
    }

    res.render('toughts/home', { toughts, search, toughtsQty });
  }

  static async showDashboard(req, res) {
    const userId = req.session.userid;

    //checar se usuário existe:
    const user = await User.findOne({
      where: {
        id: userId
      },
      include: Tought,
      plain: true,
    });

    if (!user) {
      res.redirect('/login');
    }

    const toughts = user.Toughts.map(result => result.dataValues)


    let emptyToughts = false;

    if (toughts.length === 0) {
      emptyToughts = true;
    }

    res.render('toughts/dashboard', { toughts, emptyToughts });
  }

  static createTought(req, res) {
    res.render('toughts/create')
  }

  static async createToughtPost(req, res) {
    const tought = {
      title: req.body.tought,
      UserId: req.session.userid
    }

    try {
      await Tought.create(tought);
      req.flash('message', 'Pensamento criado com sucesso!')

      req.session.save(() => res.redirect('/toughts/dashboard'));
    } catch (error) {
      console.log(error);
    }
  }

  static async removeTought(req, res) {
    const id = req.body.id;
    const userId = req.session.userid;

    try {
      await Tought.destroy({ where: { id: id, UserId: userId } });
      req.flash('message', 'Pensamento removido com sucesso.');
      req.session.save(() => res.redirect('/toughts/dashboard'));
    } catch (error) {
      console.log(error);
    }
  }

  static async editTought(req, res) {
    const id = req.params.id;
    const userId = req.session.userid;

    const tought = await Tought.findOne({ raw: true, where: { id: id } });

    if (tought.UserId !== userId) {
      return res.redirect('/toughts/dashboard')
    }

    res.render('toughts/edit', { tought });
  }

  static async editToughtPost(req, res) {
    const id = req.body.id;
    const userId = req.session.userid;

    const tought = await Tought.findOne({ where: { id: id, UserId: userId } });

    if (!tought) {
      return res.redirect('/toughts/dashboard')
    }

    const updateTought = {
      title: req.body.tought
    };

    try {
      await Tought.update(updateTought, { where: { id: id } });

      req.flash('message', 'Pensamento atualizado com sucesso.');
      req.session.save(() => res.redirect('/toughts/dashboard'));
    } catch (error) {
      console.log(error);
    }
  }
}