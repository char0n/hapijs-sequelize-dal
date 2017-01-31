'use strict';

exports.register = (server, options, next) => {
  const { sequelize } = options;

  server.expose('sequelize', sequelize);
  server.decorate('request', 'sequelize', sequelize);
  process.on('beforeExit', () => sequelize.close());

  return next();
};

exports.register.attributes = {
  name: 'sequelize',
  version: '1.0.0',
};
