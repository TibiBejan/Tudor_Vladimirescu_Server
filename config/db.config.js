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
    username: process.env.PROD_DB_USERNAME,
    password: process.env.PROD_DB_PASSWORD,
    database: process.env.PROD_DB_NAME,
    host: process.env.PROD_DB_HOSTNAME,
    port: process.env.PROD_DB_PORT,
    dialect: 'mysql'
    // dialectOptions: {
    //   bigNumberStrings: true,
    //   ssl: {
    //     ca: fs.readFileSync(__dirname + '/mysql-ca-main.crt')
    //   }
    // }
  }
};
