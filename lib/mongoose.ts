import mongoose from 'mongoose';

let isConnected = false; // variable to check if mongoose is connected

export const connectToDB = async () => {
  mongoose.set('strictQuery', true);

  if (!process.env.MONGODB_URL) {
    throw new Error("MONGODB_URL not found in the environment variables.");
  }

  if (isConnected) {
    return console.log("Already connected to MongoDB");
  }

  try {
    await mongoose.connect(process.env.MONGODB_URL);
    isConnected = true;
    console.log("Connected to MongoDB"); // Testing
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    alert("Error in connecting with mongodb") 
  }
};
