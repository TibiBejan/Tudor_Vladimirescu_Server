import common from './constants.common.js';
import devConstants from './constants.dev.js';
import productionConstants from './constants.production.js';
import {config} from 'dotenv';
config();


const getEnvironmentSpecificConstants = (env) => {
    switch(env) {
        case 'development':
            return devConstants;
        case 'production':
            return productionConstants;
        default:
            throw new Error(`no matching constants file found for env: ${env}`);
    }
};

const envVars = Object.assign(common, getEnvironmentSpecificConstants(process.env.NODE_ENV));

export default envVars;