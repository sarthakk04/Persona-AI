import mongoose from "mongoose";
import { personaAiDb } from "@/constants";
import "@/models/personas.models";
import "@/models/conversations.models";
import "@/models/messages.models";

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    // If already connected, skip
    return;
  }

  if (mongoose.connection.readyState >= 1) {
    isConnected = true;
    return;
  }

  try {
    const connectionInstance = await mongoose.connect(process.env.MONGO_URI, {
      dbName: personaAiDb,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log(
      `Mongo Connected Host Name: ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.log(err);
  }
}
