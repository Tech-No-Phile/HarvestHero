import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            console.log('[HarvestHero] MONGO_URI is not defined. Skipping MongoDB connection.');
            return;
        }
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`[HarvestHero] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[HarvestHero] MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};
export default connectDB;