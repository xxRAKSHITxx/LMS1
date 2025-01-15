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

// Middleware
app.use((req, res, next) => {
  console.log('Request Path:', req.path);
  console.log('Request Method:', req.method);
  console.log('Request Headers:', req.headers);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'https://udyamshala.com', 
      'http://localhost:5173',  // Local development
      'https://your-production-domain.vercel.app', // Add your exact production domain
      'https://lms-1-34wr5ym84-xxrakshitxxs-projects.vercel.app/'
    ];
    
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable preflight requests

// Routes
app.post('/api/v1/user/login', (req, res) => {
  res.json({ message: 'Login successful' });
});

app.use('/api/v1/user', userRoutes); 
app.use('/api/v1/courses', courseRoutes); 
//app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/', miscellaneousRoutes);

app.all('*', (req, res) => {
  res.status(404).send('OOPS!! 404 page not found');
});

app.use(errorMiddleware);

// Database Initialization
connectToDb();

export default app;
