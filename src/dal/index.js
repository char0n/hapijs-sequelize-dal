'use strict';

const { Sequelize } = require('sequelize');

const userRepository = require('./repositories/user');
const { bindRepository } = require('./utils');

// Warning: this module uses the shared state to circumvent the use-case of needing the sequelize
// instance reference outside of the scope of request and server. If you hit this use-case
// you are probably building the hapi.js architecture incorrectly.
//
// If this module exports isInitialize === true, you can be sure that sequelize is initialized and
// successfuly connected to your relational database.

function initializeModels(sequelize) {
  return sequelize.models;
}

function initializeRepositories(sequelize) {
  return {
    userRepository: bindRepository(sequelize, userRepository),
  };
}

const internals = {
  isInitialized: false,
  Sequelize,
  sequelize: null,
  initialize(sequelize) {
    this.sequelize = sequelize;
    Object.assign(this, initializeModels(sequelize));
    Object.assign(this, initializeRepositories(sequelize));
    this.isInitialized = true;
  },
};

module.exports = internals;
