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
app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Cors
app.all('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Credentials", true);
    next();
});

// app.use((req, res, next) => {
//     if (req.method === "OPTIONS") {
//       res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//       return res.status(200).json({});
//     }
//     next();
// });

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