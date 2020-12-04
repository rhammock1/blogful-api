require('dotenv');

module.exports = {
  "migrationsDirectory": "migrations",
  "driver": "pg",
  "database": "blogful",
  "connectionString": process.env.DB_URL,
};