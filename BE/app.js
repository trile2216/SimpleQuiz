var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var usersRouter = require('./routes/users');
var quizRouter = require('./routes/quiz');
var questionRouter = require('./routes/question');

var app = express();

const connectDB = require('./config/db');
connectDB();

const cors = require("cors");

// Allow configuring frontend origin via environment variable on Render.
// Set FRONTEND_URL to the deployed FE origin (e.g. https://your-app.onrender.com)
const allowedOrigins = [
  process.env.FRONTEND_URL || "http://localhost:5173",
  "https://sdn302-fe.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like server-to-server or Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Debug: print CORS configuration at startup so we can verify Render picked up FRONTEND_URL
console.log('CORS allowedOrigins:', allowedOrigins);
console.log('FRONTEND_URL env:', process.env.FRONTEND_URL);

app.use(cors(corsOptions));
// Ensure preflight requests use the same options and respond with the CORS headers
app.options("*", cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);
app.use('/quizzes', quizRouter);
app.use('/questions', questionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
