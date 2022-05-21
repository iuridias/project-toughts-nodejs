const express = require('express');
const ToughtController = require('../controllers/ToughtController');
const router = express.Router();

//helpers
const checkAuth = require('../helpers/auth').checkAuth;


router
  .get('/add', checkAuth, ToughtController.createTought)
  .post('/add', checkAuth, ToughtController.createToughtPost)
  .get('/dashboard', checkAuth, ToughtController.showDashboard)
  .post('/remove', checkAuth, ToughtController.removeTought)
  .get('/edit/:id', checkAuth, ToughtController.editTought)
  .post('/edit', checkAuth, ToughtController.editToughtPost)
  .get('/', ToughtController.showToughts)
;

module.exports = router;