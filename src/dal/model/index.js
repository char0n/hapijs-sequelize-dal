'use strict';

const userModelFactory = require('./user');

module.exports = (sequelize, DataTypes) => ({
  userModel: userModelFactory(sequelize, DataTypes),
});
