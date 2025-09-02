import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDB } from '../Database/index.js';
import userRouter from '../Routes/userroute.js';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Trust proxy for secure cookies behind reverse proxies
if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173')
    .split(',')
    .map((o) => o.trim());
const allowAllInDev = process.env.CORS_ALLOW_ALL === 'true' || process.env.NODE_ENV !== 'production';

app.use(
    cors({
        origin: allowAllInDev
            ? true // reflect request origin in dev
            : (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }
                return callback(new Error('Not allowed by CORS'));
            },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
);

// Common middleware
app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(cookieParser());

app.use(express.static("public"));

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

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Add routes
app.use('/api/users', userRouter);

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl
    });
});

// Standard Vercel serverless function format
export default function handler(req, res) {
    return app(req, res);
}
