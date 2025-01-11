import { configDotenv } from 'dotenv';
configDotenv();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import userRoutes from './routes/user.routes.js';
import courseRoutes from './routes/course.routes.js';
import miscellaneousRoutes from './routes/miscellaneous.routes.js';
import connectToDb from './config/db.config.js';
import errorMiddleware from './middleware/error.middleware.js';

const app = express();

// CORS Configuration
const corsOptions = {
  origin: 'https://lms-1-pi.vercel.app',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'Cookie'
  ],
  exposedHeaders: ['set-cookie']
};

// Apply CORS middleware first
app.use(cors(corsOptions));

// Handle preflight requests
app.options('*', cors(corsOptions));

// Other middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// Set additional security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie'
  );
  next();
});

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/courses', courseRoutes);
app.use('/api/v1/', miscellaneousRoutes);

// 404 handler
app.all('*', (req, res) => {
  res.status(404).send('OOPS!! 404 page not found');
});

// Error middleware
app.use(errorMiddleware);

// Connect to database
connectToDb();

// Start server only if not imported as a module
if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;