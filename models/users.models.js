import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true }
);

export const Users =
  mongoose.models.Users || mongoose.model("Users", userSchema);
