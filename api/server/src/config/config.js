require("dotenv").config();

module.exports = {
  development: {
    database: "cyan",
    username: "postgres",
    password: "admin",
    host: "127.0.0.1",
    dialect: "postgres",
  },

  test: {
    database: "cyan_test",
    username: "postgres",
    password: "admin",
    host: "127.0.0.1",
    dialect: "postgres",
  },

  production: {
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
  },
};
