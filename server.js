// Call Modules
const path = require('path');

// Third-party Modules
const express = require('express');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const mongoSanitize = require('express-mongo-sanitize');

// required Modules
dotenv.config({ path: 'config.env' });
const dbConnection = require('./config/database');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./middlewares/errorMiddleware');

// Routes
const mountRoutes = require('./routes');

// Connect with db
dbConnection();

// express app
const app = express();

// Enable other domains to acccess your application
app.use(cors());
app.options('*', cors());

// Compress all responses
app.use(compression());

// Middlewares
app.use(express.json({ limit: '20kb' }));
app.use(express.static(path.join(__dirname, 'uploads')));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// To apply data sanitization
app.use(mongoSanitize());
// app.use(xss());

// Limit each IP to 100 requests per `window` (here, per 15 minutes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message:
    'Too many accounts created from this IP, please try again after an hour',
});

app.use('/api', limiter);

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    whitelist: ['firstName', 'lastName', 'country', 'city'],
  })
);

// Mount Routes
mountRoutes(app);

app.get('/', (req, res) => {
  res.status(200).send('Hello form server side!');
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handling middleware
app.use(globalErrorHandler);

const PORT = process.env.PORT || 2000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// Handle rejection outside express
process.on('unhandledRejection', (err) => {
  console.error(`UnhandledRejection Errors: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
