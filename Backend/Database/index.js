import mongoose from "mongoose";

const connectDB = async (mongoUri) => {
    try {
        const uri = mongoUri || process.env.MONGO_DB;
        await mongoose.connect(uri, {

        });
        console.log("Database connected!");

    } catch (error) {
        console.log("Database connection error", error);
        process.exit(1);

    }
}
export { connectDB }