// =================== Modules Imports =================== //
import { Sequelize  } from 'sequelize';
import app from './config/express.config.js';
import envVars from './constants/index.js';

// =================== DB Init =================== //
const sequelize = new Sequelize(envVars.MYSQL_DB_NAME, envVars.MYSQL_USER, envVars.MYSQL_PWD, {
    host: envVars.MYSQL_HOST,
    dialect: 'mysql',
    port: 3306,
});

// =================== Server Init =================== //
const port = envVars.port || 3001
app.listen(port, async () => {
    console.log(`Server App running on ${envVars.env} mode with port ${port || '3001'}...`);
    try {
        await sequelize.authenticate();
        // await sequelize.sync({force: true})
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
});