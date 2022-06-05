require('dotenv/config');

module.exports = {
  development: {
    username: process.env.MYSQL_USER_DEV,
    password: process.env.MYSQL_PWD_DEV,
    database: process.env.MYSQL_DB_NAME_DEV,
    host: process.env.MYSQL_HOST_DEV,
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  test: {
    username: process.env.MYSQL_USER_DEV,
    password: process.env.MYSQL_PWD_DEV,
    database: process.env.MYSQL_DB_NAME_DEV,
    host: process.env.MYSQL_HOST_DEV,
    port: 3306,
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true
    }
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'mysql',
    dialectOptions: {
      bigNumberStrings: true,
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
}
