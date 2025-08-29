import mongoose from "mongoose";

const connectDB = async (mongoUri) => {
    try {
        // Check if already connected
        if (mongoose.connection.readyState === 1) {
            console.log("Database already connected!");
            return;
        }

        const uri = mongoUri || process.env.MONGO_DB;
        
        if (!uri) {
            throw new Error("MongoDB URI is not defined");
        }

        await mongoose.connect(uri, {
            // Add connection options for better stability
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log("Database connected successfully!");

    } catch (error) {
        console.log("Database connection error:", error.message);
        // Don't exit process in serverless environment
        throw error;
    }
}

export { connectDB }