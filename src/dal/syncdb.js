require('pg').defaults.parseInt8 = true;
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');
const { curry, flattenDeep, flow, map } = require('lodash/fp');

const dsn = require('../../dsn.json');

const sequelize = new Sequelize(dsn.database, dsn.username, dsn.password, {
  dialect: dsn.dialect,
  host: dsn.host,
  port: dsn.port,
});
const tableDefinitionsPath = path.join(__dirname, 'sql', 'tables');
const migrationsPath = path.join(__dirname, 'migrations');

function getFileList(directory) {
  return fs.readdirSync(directory).map(file => path.join(directory, file));
}

function getSqlCommands(filePath) {
  const sql = fs.readFileSync(filePath, 'utf8');
  return sql.split(';').filter(cmd => cmd.trim() !== '');
}

const syncDb = curry((sequelizeLink, directory) => {
  const sqlCommands = flow(getFileList, map(getSqlCommands), flattenDeep)(directory);
  let promise = Promise.resolve();
  sqlCommands.forEach(sqlCommand => {
    promise = promise.then(() => sequelizeLink.query(sqlCommand))
  });
  return promise;
});

const fakeMigrations = curry((sequelizeLink, directory) => {
  const migrations = flow(getFileList, map(path.basename))(directory);
  let promise = Promise.resolve();
  migrations.forEach(migration => {
    promise = promise.then(() => sequelizeLink.query('INSERT INTO "SequelizeMeta" VALUES ($migration)', {
      bind: { migration }
    }))
  });
  return promise;
});

sequelize
  .authenticate()
  .then(() => syncDb(sequelize, tableDefinitionsPath))
  .then(() => fakeMigrations(sequelize, migrationsPath))
  .then(() => console.log('All done. Database synced.'))
  .catch(console.error)
;
