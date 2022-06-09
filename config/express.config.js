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
// var corsOptions = {
//     'Access-Control-Allow-Origin': '*',
// }
  
// app.use(cors());
app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json())
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

app.use(cors(), function(req, res, next) {
    res.header("Access-Control-Allow-Origin", ["http://localhost:3000", "https://tudor-vladimirescu.netlify.app"]); // update to match the domain you will make the request from
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// // This middleware takes care of the origin when the origin is undefined. Origin is undefined when request is local
// app.use((req, _, next) => {
//     req.headers.origin = req.headers.origin || req.headers.host;
//     next();
// });

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