'use strict';

const userRepository = require('./repositories/user');
const { bindRepository } = require('./utils');

exports.register = (server, options, next) => {
  const { sequelize } = server.plugins.sequelize;
  const userRepositoryBound = bindRepository(sequelize, userRepository);

  server.expose('userRepository', userRepositoryBound);

  Object.keys(sequelize.models).forEach(modelName => server.expose(modelName, sequelize.models[modelName]));

  server.decorate('request', 'dal', Object.assign({
    userRepository: userRepositoryBound,
  }, sequelize.models));

  return next();
};

exports.register.attributes = {
  name: 'dal',
  version: '1.0.0',
  dependencies: 'sequelize',
};

