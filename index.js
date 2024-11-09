// index.js
import express from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';

dotenv.config();  // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());  // To parse incoming JSON requests

// Routes
app.use('/api/users', userRoutes);  // User routes

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
