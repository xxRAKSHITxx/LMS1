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

// Custom CORS middleware wrapper
const allowCors = (fn) => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Alternative: res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  return await fn(req, res);
};

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// CORS setup
const corsOptions = {
  origin: 'https://lms-1-pi.vercel.app', // Replace with your frontend URL
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Example route to test allowCors function
const handler = (req, res) => {
  const d = new Date();
  res.end(d.toString());
};
app.get('/test-cors', allowCors(handler));

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/courses', courseRoutes);
// app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/', miscellaneousRoutes);

// Catch-all for undefined routes
app.all('*', (req, res) => {
  res.status(404).send('OOPS!! 404 page not found');
});

// Error middleware
app.use(errorMiddleware);

// DB initialization
connectToDb();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
