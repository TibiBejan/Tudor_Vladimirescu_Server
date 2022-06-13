// =================== Modules Imports =================== //
import app from './config/express.config.js';
import envVars from './constants/index.js';

// =================== Server Init =================== //
const port = envVars.port || 3001
app.listen(port, async () => {
    console.log(`Server App running on ${envVars.env} mode with port ${port || '3001'}...`);
});