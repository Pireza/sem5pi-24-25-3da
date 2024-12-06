import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Allergy from '../Models/Allergy';

dotenv.config();

const connectDB = async (): Promise<void> => {
    try {
        // Connect to MongoDB using the connection string
        await mongoose.connect(process.env.MONGODB_URI as string);
        await Allergy.syncIndexes();

        console.log('MongoDB connected successfully');
    } catch (err: any) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

export default connectDB;
