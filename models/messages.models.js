import mongoose, { Schema } from "mongoose";

const messagesSchema = new Schema(
  {
    conversationFrom: {
      type: Schema.Types.ObjectId,
      ref: "Conversations",
      required: true,
    },
    sender: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);


export const Messages =
  mongoose.models.Messages || mongoose.model("Messages", messagesSchema);
