import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const MONGO_URI = process.env.MONGO_URI;
    
    if (!MONGO_URI) {
      console.error('❌ MONGO_URI not found in environment variables');
      process.exit(1);
    }

    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 20000
    });
    
    console.log('✅ MongoDB connected');
  } catch (err: any) {
    console.error('❌ MongoDB connection failed:', err.reason?.message || err.message);
    console.error('Details:', err.reason || err);
    process.exit(1);
  }
}
