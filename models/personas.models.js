import mongoose, { Schema } from "mongoose";

const personaSchema = new Schema(
  {
    personaname: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    promptDef: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);


export const Personas =
  mongoose.models.Personas || mongoose.model("Personas", personaSchema);
