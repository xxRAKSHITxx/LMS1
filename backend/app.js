import { configDotenv } from 'dotenv';
configDotenv();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js'; 
import courseRoutes from './routes/course.routes.js'; 
//import paymentRoutes from './routes/payment.routes.js';
import miscellaneousRoutes from './routes/miscellaneous.routes.js';
import express from 'express';
import connectToDb from './config/db.config.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));
//app.use(cors({ origin: [process.env.CLIENT_URL], credentials: true }));
const allowMethods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'];
const allowHeaders = [
  'Content-Type',
  'Authorization',
  'X-Content-Type-Options',
  'Accept',
  'X-Requested-With',
  'Origin',
  'Access-Control-Request-Method',
  'Access-Control-Request-Headers',
];

app.options('*', (req, res) => {
  console.log('Preflight request received');

  const origin = req.headers.origin;
  const requestedMethod = req.headers['access-control-request-method'];
  const requestedHeaders = req.headers['access-control-request-headers'];

  if (
    origin === 'https://lms-1-kyhjf40a9-xxrakshitxxs-projects.vercel.app/' &&
    allowMethods.includes(requestedMethod) &&
    requestedHeaders?.split(',').every(header => allowHeaders.includes(header.trim()))
  ) {
    console.log('Preflight request passed');

    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Methods', allowMethods.join(','));
    res.setHeader('Access-Control-Allow-Headers', allowHeaders.join(','));
    return res.status(204).send();
  } else {
    console.log('Preflight request failed');
    return res.status(403).send('CORS policy not satisfied');
  }
});


app.use('/api/v1/user', userRoutes); 
app.use('/api/v1/courses', courseRoutes); 
//app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/', miscellaneousRoutes);
 

app.all('*', (req, res) => {
    res.status(404).send('OOPS!! 404 page not found');
})

app.use(errorMiddleware);

// db init
connectToDb();

export default app;