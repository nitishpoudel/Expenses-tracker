import app from "./app.js";
import express from "express"
import dotenv from "dotenv"
import { connectDB } from "./Database/index.js";
import userRouter from "./Routes/userroute.js";

// Load environment variables - don't specify path for Vercel
dotenv.config();

//Default middleware//
app.use(express.json());
app.use(express.urlencoded({extended:true}));

const PORT = process.env.PORT;
const MONGO_DB = process.env.MONGO_DB

app.get('/home',(req,res) => {
    res.send('hello')
})

// Health check endpoint for Vercel
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Server is running',
        timestamp: new Date().toISOString()
    });
});

app.use('/api/users',userRouter)


let isConnected = false;

const connectToDatabase = async () => {
    if (!isConnected) {
        try {
            await connectDB(MONGO_DB);
            isConnected = true;
            console.log("Database connected successfully");
        } catch (error) {
            console.log("Database failed to connect:", error);
        }
    }
};

// Middleware to ensure database connection before handling requests
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

// For local development
if (process.env.NODE_ENV !== 'production') {
    const listenPort = PORT || 8000;
    app.listen(listenPort, () => console.log(`Server is running on ${listenPort}`));
}

// Export for Vercel serverless functions
export default app;

