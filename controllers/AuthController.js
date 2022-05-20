const User = require('../models/User');
const bcrypt = require('bcryptjs');

module.exports = class AuthController {
  static login(req, res) {
    res.render('auth/login')
  }

  static register(req, res) {
    res.render('auth/register')
  }

  static async registerPost(req, res) {
    const { name, email, password, confirmpassword } = req.body;

    //Validação de senha
    if (password != confirmpassword) {
      req.flash('message', 'As senhas não conferem. Tente novamente!');
      res.render('auth/register');
      return
    }
    //Validar se usuário existe
    const checkIfUserExists = await User.findOne({ where: { email: email } });
    if (checkIfUserExists) {
      req.flash('message', 'O email já está em uso.');
      res.render('auth/register');
      return
    }

    //Criar a senha
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name,
      email,
      password: hashedPassword
    }

    try {
      const createdUser = await User.create(user);

      //autenticar usuário - iniciar sessão
      req.session.userid = createdUser.id;

      req.flash('message', 'Cadastro realizado com sucesso!');

      req.session.save(() => {
        res.redirect('/');
      })
    } catch (error) {
      console.log(error);
    }
  }

  static logout(req, res) {
    req.session.destroy();
    res.redirect('/');
  }

  static async loginPost(req, res) {
    const { email, password } = req.body;
    //Validar se usuário existe
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      req.flash('message', 'Usuário não encontrado.');
      res.render('auth/login');
      return
    }
    //Validar senha
    const passwordMath = bcrypt.compareSync(password, user.password);
    if (!passwordMath) {
      req.flash('message', 'Senha inválida. Tente novamente.');
      res.render('auth/login');
      return
    }
    
    req.session.userid = user.id;
    req.flash('message', 'Login realizado com sucesso!');
    req.session.save(() => {
      res.redirect('/');
    });
  }
}