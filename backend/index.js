import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import usersRouter from './routes/users.js';
import recipesRouter from './routes/recipes.js';
import validate from './middleware/validate.js';
import connectDb from './config/db.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users',validate, usersRouter);
app.use('/api/recipes', validate,recipesRouter);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
connectDb();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
