import mongoose from "mongoose";
import { ENV } from "./env.js";

export async function connectDB(): Promise<void> {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(ENV.MONGODB_URI);
    console.log(
      `[MongoDB] Connected successfully to host: ${conn.connection.host}, database: ${conn.connection.name}`,
    );
  } catch (error) {
    console.error("[MongoDB] Connection error:", error);
    process.exit(1);
  }
}
