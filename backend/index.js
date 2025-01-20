// imports and requires
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./middleware/errorHandler');
const authRouter = require('./routes/auth');
const messageRouter = require('./routes/message');
const userRouter = require('./routes/user');

const app = express();

// Application level middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the backend API' })
});

app.use('/auth', authRouter);
app.use('/message', messageRouter);
app.use('/users', userRouter);

// Global error handler
app.use(errorHandler);

const port = process.env.PORT || 3333;
app.listen(port, () => console.log(`Server running at http://localhost:${port}`));