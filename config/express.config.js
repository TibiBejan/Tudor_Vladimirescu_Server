// =================== Modules Imports =================== //
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser  from 'body-parser';
import errorController from '../controller/error.controller.js';

// =================== Routes Imports =================== //
import routes from '../routes/index.js';
// =================== App Init =================== //
const app = express()

// =================== Global Middlewares =================== //
const whitelist = ["http://localhost:3000", "https://tudor-vladimirescu.netlify.app"]
app.use(cors({
    "origin": function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
          callback(null, true)
        } else {
          callback(new Error('Not allowed by CORS'))
        }
    },
    "optionsSuccessStatus": 200,
    "credentials": true,
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "allowedHeaders":  ['X-Requested-With', 'content-type']
}));
app.use(helmet());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(morgan('combined'));

// This middleware takes care of the origin when the origin is undefined. Origin is undefined when request is local
app.use((req, _, next) => {
    req.headers.origin = req.headers.origin || req.headers.host;
    next();
});

// =================== Routes =================== //
app.get('/api/v1', (req, res) => {
    res.send('Hello World!')
});
app.use('/api/v1', routes);
  
// =================== Error Middlewares =================== //
app.all('*', (req, res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorController);

export default app;