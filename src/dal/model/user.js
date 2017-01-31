'use strict';

const { functorTrait } = require('../utils');

module.exports = (sequelize, DataTypes) => {
  const userModel = {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    firstName: {
      type: DataTypes.STRING,
      field: 'first_name',
    },
    lastName: {
      type: DataTypes.STRING,
      field: 'last_name',
    }
  };

  const config = {
    instanceMethods: Object.assign({}, functorTrait(() => sequelize.models.userModel)),
  };

  return sequelize.define('userModel', userModel, config);
};
/* eslint-enable new cap */
