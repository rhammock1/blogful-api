require('dotenv');


module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "database": (process.env.NODE_ENV === 'test')
    ? 'blogful-test'
    : 'blogful',
  "connectionString": (process.env.NODE_ENV === 'test')
    ? process.env.TEST_DB_URL
    : process.env.DB_URL,
};