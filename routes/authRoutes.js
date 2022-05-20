const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');

router
  .get('/login', AuthController.login)
  .get('/register', AuthController.register)
  .post('/register', AuthController.registerPost)
  .get('/logout', AuthController.logout)
  .post('/login', AuthController.loginPost)
;

module.exports = router;
