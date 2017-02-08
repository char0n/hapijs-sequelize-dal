'use strict';

const userModelFactory = require('./user');

module.exports = (sequelize, DataTypes) => {
  userModelFactory(sequelize, DataTypes);
  
  return sequelize.models;
};
