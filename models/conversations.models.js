import mongoose, { Schema } from "mongoose";

const convoModel = Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    persona: {
      type: Schema.Types.ObjectId,
      ref: "Personas",
      required: true,
    },
  },
  { timestamps: true }
);

export const Conversations =
  mongoose.models.Conversations || mongoose.model("Conversations", convoModel);
