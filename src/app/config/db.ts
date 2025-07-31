/* eslint-disable no-console */
import config from ".";
import mongoose from "mongoose";

let isConnected = false;

const connectMongoDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    console.log("✅ Database is already connected");
    return;
  }

  try {
    const db = await mongoose.connect(config.MongoDB_URI, {
      autoIndex: config.NODE_ENV === "development", // Automatically create indexes in development
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("✅ Database connected");

    // Handles disconnect and errors for long-running apps
    mongoose.connection.on("disconnected", () => {
      console.log("⚠️ Database disconnected");
      isConnected = false;
    });

    // Handles error events for long-running apps
    mongoose.connection.on("error", error => {
      console.error("❌ Database error: ", error);
      isConnected = false;
    });
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
};

export default connectMongoDB;
