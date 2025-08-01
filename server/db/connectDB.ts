
import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;
        
        if (!mongoURI) {
            console.error('MONGO_URI is not defined in environment variables');
            console.error('Available environment variables:', Object.keys(process.env));
            throw new Error('MONGO_URI is not defined');
        }
        
        await mongoose.connect(mongoURI);
        console.log('mongoDB connected successfully.');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}
export default connectDB;
