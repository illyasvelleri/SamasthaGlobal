import mongoose, { Schema, models, model } from "mongoose";

const MasalaSchema = new Schema(
  {
    bookName: { type: String, required: true, index: true },
    page: { type: Number, required: true },
    index: { type: Number, required: true },

    kitab: { type: String, default: null },
    bab: { type: String, default: null },
    fasl: { type: String, default: null },

    paragraph: { type: String, required: true },

    customId: { type: String, required: true, unique: true },

    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export default models.Masala || model("Masala", MasalaSchema);
