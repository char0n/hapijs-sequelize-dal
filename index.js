require('pg').defaults.parseInt8 = true;
const { Sequelize } = require('sequelize');
const aguid = require('aguid');
const { assoc } = require('ramda');
const { tap, map } = require('lodash/fp');

const dal = require('./src/dal');
const userRepository = require('./src/dal/repositories/user');
const dsn = require('./dsn.json');
const { bindRepository, toJSON } = require('./src/dal/utils');

const sequelize = new Sequelize(dsn.database, dsn.username, dsn.password, { dialect: dsn.dialect });
// Bounding sequelize instance into dal.
sequelize.import('./src/dal/model');
dal.initialize(sequelize);

// Running query on bound dal.
dal.userRepository.findAll().then(map(toJSON)).then(console.log);

// Working with models.
const newUser = dal.userModel.build({ id: aguid(), username: 'test', firstName: 'first', lastName: 'last' });
dal.userRepository.save(newUser);

// Runnig query on userRepository.
userRepository.findAll().run(sequelize).then(map(toJSON)).then(console.log);

// Binding repository and running query.
const userRepositoryBound = bindRepository(sequelize, userRepository);
userRepositoryBound.findAll().then(map(toJSON)).then(console.log);

// Using model instances as functors.
Promise
  .resolve(dal.userModel.build({ id: aguid(), username: 'test1', firstName: 'first1', lastName: 'last1' }))
  .then(dal.userRepository.save)
  .then(() => dal.userRepository.findByUsername('test1'))
  .then(user => user.map(assoc('firstName', 'first is last'))) // Functor interface.
  .then(tap(user => dal.userRepository.update(user)))
  .then(toJSON)
  .then(console.log)
;
