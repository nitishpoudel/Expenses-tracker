import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from '../Database/index.js';
import userRouter from '../Routes/userroute.js';

// Load environment variables
dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:5174,https://expenses-tracker-brown-eta.vercel.app')
    .split(',')
    .map((o) => o.trim());
const allowAllInDev = process.env.CORS_ALLOW_ALL === 'true' || process.env.NODE_ENV !== 'production';

app.use(
    cors({
        origin: allowAllInDev
            ? true
            : (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }
                return callback(new Error('Not allowed by CORS'));
            },
        credentials: true
    })
);

// Middleware
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Database connection state
let isConnected = false;

const connectToDatabase = async () => {
    if (!isConnected) {
        try {
            await connectDB(process.env.MONGO_DB);
            isConnected = true;
            console.log("Database connected successfully");
        } catch (error) {
            console.log("Database failed to connect:", error);
            throw error;
        }
    }
};

// Database connection middleware
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(500).json({
            success: false,
            message: 'Database connection failed'
        });
    }
});

// Routes
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.get('/home', (req, res) => {
    res.send('hello');
});

app.use('/api/users', userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

export default app;
