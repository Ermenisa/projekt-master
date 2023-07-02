const pgp = require('pg-promise')();
const connection = {
  host: 'localhost',
  port: 5432,
  database: 'your_database_name',
  user: 'your_username',
  password: 'your_password'
};
const db = pgp(connection);

module.exports = db;
