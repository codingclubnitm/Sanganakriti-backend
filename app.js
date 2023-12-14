const express = require('express');
const cors = require('cors');
const ErrorHandler = require('./middleware/error')
const cookieParser = require('cookie-parser');

const app = express();

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cors Handling
app.use(cors({ origin: true, credentials: true }));

// Cookie Parser
app.use(cookieParser());

// Load Route Files
const Auth = require('./routes/auth')

// Mount Routes
app.use('/api/v1/auth', Auth)

// Error Handler
app.use(ErrorHandler);

module.exports = app;