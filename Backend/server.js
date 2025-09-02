import app from "./app.js";
import dotenv from "dotenv"
import { connectDB } from "./Database/index.js";
import userRouter from "./Routes/userroute.js";


dotenv.config();

const PORT = process.env.PORT;
const MONGO_DB = process.env.MONGO_DB

let isConnected = false;

const connectToDatabase = async () => {
    if (!isConnected) {
        try {
            await connectDB(MONGO_DB);
            isConnected = true;
            console.log("Database connected successfully");
        } catch (error) {
            console.log("Database failed to connect:", error);
            throw error;
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

// Add routes to the app (after database connection middleware)
app.get('/',(req,res) => {
    res.send({
        activeStatus:true,
        error:false,
    })
})

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

app.use('/api/users',userRouter)


// For local development
if (process.env.NODE_ENV !== 'production') {
    const listenPort = PORT || 8000;
    app.listen(listenPort, () => console.log(`Server is running on ${listenPort}`));
}

// Export for Vercel serverless functions
export default app;

