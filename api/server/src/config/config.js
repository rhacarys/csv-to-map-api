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
    use_env_variable: "HEROKU_POSTGRESQL_PINK_URL",
  },
};
