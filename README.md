# hapijs-sequelize-dal

Prototype of **D**ata **A**ccess **L**ayer using sequelizejs (with Hapi.js plugins)

## Requirements

Install PostgreSQL server. All raw queries are hardcoded into source code and all *.sql files in `postgres` dialect.

## Installation

```sh
$ npm install
```

## Configuration

Edit file `dsn.json` and provide of details for successfully connecting to your database.

## Initial syncing

This DAL implementation contains script that synchronizes all sql files in `dal/sql/tables` directory.
The idea is that in this directory you keep all your tables definitions in actual state. 
When running `syncdb` task, all sql statements in these files are executed against the database defined in `dsn.json`. 

Since sequelize migrations doesn't provide us with mechanism for faking migrations the final part of `syncdb`
process is **faking** the application of all the migrations. The reason why we do that is that we don't
want to apply any migrations in a pristine up-to-date database in new project installations.

```sh
$ npm run syncdb
```

## Running migrations
 
We run migrations only on project instances that got updated or redeployed. Migrations are introducing
progressive structural enhancements on your schema or migrate data in your tables. You usually want to run
migrations before your projects backend starts.

```sh
$ npm run migrate
```

In order to be sure your project is running on up-to-date schema, run migrations before your server starts.

```sh
$ npm run migrate && node index.js
``` 
 
## Running examples
 
All examples of using this DAL are provided in `index.js` file located at the root of this repository.
Feel free to prototype your own examples and use-cases in this file and if you feel like it, provide a pull request.
You can run this file by two commands:
 
```sh
$ node index.js
```
or
```sh
$ npm run test
```

### Credits

Credits to @kkristal for finalizing this dal design.
