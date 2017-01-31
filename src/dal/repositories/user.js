'use strict';

const { zipObject, flow, get, head } = require('lodash/fp');
const { Reader: reader } = require('monet');
const { Sequelize } = require('sequelize');

const { QueryTypes } = Sequelize;

const { buildWhereQuery, buildLimitAndOffsetQuery } = require('../utils');

// Generic accessors
// -----------------

const findOne = ({ where = {} } = {}) => reader(
  config => config.query(
    `SELECT * FROM "user" ${buildWhereQuery(config, where, { model: config.models.userModel })} LIMIT 1`,
    {
      type: QueryTypes.SELECT,
      model: config.models.userModel,
      mapToModel: true,
    }
  ).then(head)
);

const findById = userId => reader(
  config => findOne({ where: { id: userId } }).run(config)
);


const findAll = ({ offset, limit, where = {} } = {}) => reader(
  config => config.query(
    `SELECT * FROM "user" ${buildWhereQuery(config, where, { model: config.models.userModel })} ` +
    ` ORDER BY username ASC ${buildLimitAndOffsetQuery(config, { limit, offset })}`,
    {
      type: QueryTypes.SELECT,
      model: config.models.userModel,
      mapToModel: true,
    }
  )
);

const count = ({ where = {} } = {}) => reader(
  config => config.query(`SELECT COUNT(*) AS count FROM "user" ${buildWhereQuery(config, where, {})}`)
    .then(flow(head, head, get('count'), Number))
);

const findAndCountAll = ({ offset, limit, where = {} } = {}) => reader(
  (config) => {
    const rowsPromise = findAll({ offset, limit, where }).run(config);
    const countPromise = count({ where }).run(config);
    return Promise.all([rowsPromise, countPromise])
      .then(zipObject(['rows', 'count']));
  }
);

const save = ({ id, username, firstName, lastName }) => reader(config => config.query(
  'INSERT INTO "user" (id, username, first_name, last_name) VALUES ($id, $username, $firstName, $lastName)',
  {
    type: QueryTypes.INSERT,
    bind: { id, username, firstName, lastName },
  })
);

const update = ({ id, firstName, lastName }) => reader(
  config => config.query(
    'UPDATE "user" SET first_name=$firstName, last_name=$lastName WHERE id=$id',
    {
      type: QueryTypes.UPDATE,
      bind: { id, firstName, lastName },
    }
  )
);

const remove = ({ where = {} }) => reader(
  config => config.query(
    `DELETE FROM user ${buildWhereQuery(config, where, { model: config.models.userModel })}`,
    {
      type: QueryTypes.DELETE,
      model: config.models.userModel,
    }
  )
);


// Specialized accessors
// ---------------------

const findByUsername = username => reader(
  config => findOne({ where: { username }}).run(config)
);


module.exports = {
  findById,
  findOne,
  findAll,
  findAndCountAll,
  count,
  save,
  update,
  remove,

  findByUsername,
};
