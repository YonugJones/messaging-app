// Imports
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const errorHandler = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/authMiddleware');
const corsCredentials = require('./middleware/corsCredentials');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/auth');
const chatRouter = require('./routes/chat');
const logoutRouter = require('./routes/logout');
const messageRouter = require('./routes/message');
const tokenRouter = require('./routes/token');
const userRouter = require('./routes/user');

// Define the main app
const app = express();

// Handle options credentials check before CORS
// fetch cookie credentials requirement
app.use(corsCredentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Built in Middleware for JSON
app.use(express.json());

// Built in Middleware to Handle Urlencoded Form Data
app.use(express.urlencoded({ extended: true }));

// middleware for cookies
app.use(cookieParser());

// Index Auth and Token routes (no token needed)
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend API' })
});
app.use('/auth', authRouter);
app.use('/refresh', tokenRouter);
app.use('/logout', logoutRouter);

//Middleware authenticates tokens for all routes below
app.use(authenticateToken);

// Rest of routes that need token auth
app.use('/chats', chatRouter);
app.use('/messages', messageRouter);
app.use('/users', userRouter);

// Global Error Handler
app.use(errorHandler);

// Start server
const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));