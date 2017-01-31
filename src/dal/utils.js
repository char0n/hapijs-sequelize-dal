'use strict';

const { isInt } = require('validator');
const { curry, isFunction, mapValues, invoke } = require('lodash/fp');

const buildWhereQuery = curry((config, whereCriteria, options) => {
  const { QueryGenerator } = config.getQueryInterface();
  return QueryGenerator.whereQuery(whereCriteria, options);
});

const buildLimitAndOffsetQuery = curry((config, { limit, offset }) => {
  const { QueryGenerator } = config.getQueryInterface();
  let query = '';
  if (isInt(String(limit))) {
    query += ` LIMIT ${QueryGenerator.escape(limit)}`;
  }
  if (isInt(String(offset))) {
    query += ` OFFSET ${QueryGenerator.escape(offset)}`;
  }
  return query;
});

const bindRepositoryFunc = curry((config, repositoryFunc) => (...args) => repositoryFunc(...args).run(config));

const bindRepository = curry((config, repository) => mapValues(bindRepositoryFunc(config), repository));

const runQueryOnConfig = curry((config, readerOrRepositoryFunction) => (...args) => {
  if (isFunction(readerOrRepositoryFunction)) {
    return bindRepositoryFunc(config, readerOrRepositoryFunction)(...args);
  }
  return readerOrRepositoryFunction.run(config);
});

const functorTrait = modelAccessor => ({
  map: function(func) { // Allow proper proper binding of the trait.
    const model = modelAccessor();
    return model.build(func(this.toJSON()));
  },
});

const toJSON = invoke('toJSON');

module.exports = {
  toJSON,
  runQueryOnConfig,
  buildWhereQuery,
  buildLimitAndOffsetQuery,
  bindRepositoryFunc,
  bindRepository,
  functorTrait,
};
