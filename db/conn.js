const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  'toughts',
  'root',
  'root',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);

module.exports = sequelize;