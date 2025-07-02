import mongoose from "mongoose";

let isConnected = false;

const connectDb = async (): Promise<void> => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: "petpalace",
    });

    isConnected = true;
    console.log("✅ MongoDB connected:", db.connection.name);
  } catch (error: unknown) {
    const err = error as Error;
    console.error("❌ MongoDB connection error:", err.message);
    throw err;
  }
};

export default connectDb;
