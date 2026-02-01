// import mongoose from "mongoose";

// const FiqhChunkSchema = new mongoose.Schema({
//   book: { type: String, required: true },          // "Fathul Mueen"
//   madhhab: { type: String, default: "Shafi" },
//   topic: { type: String, required: true, index: true },
//   subtopic: { type: String, index: true },
//   chunkId: { type: String, required: true, unique: true },
//   order: { type: Number },
//   text: { type: String, required: true },
//   createdAt: { type: Date, default: Date.now },
// });

// export default mongoose.models.FiqhChunk ||
//   mongoose.model("FiqhChunk", FiqhChunkSchema);


import mongoose from "mongoose";

const FiqhChunkSchema = new mongoose.Schema({
  book: { type: String, required: true },            // e.g., "Fathul Mueen"
  madhhab: { type: String, default: "Shafi" },       // default madhhab
  topic: { type: String, required: true, index: true },  // main topic
  subtopic: { type: String, index: true },               // optional subtopic
  chunkId: { type: String, required: true, unique: true }, // unique ID
  order: { type: Number },                            // optional ordering
  text: { type: String, required: true },            // full chunk text
  keywords: { type: [String], default: [] },         // optional keywords for fast search
  length: { type: Number },                          // optional length of chunk (words/characters)
  summary: { type: String },                         // optional summary of the chunk
  createdAt: { type: Date, default: Date.now },
});

// **Text index** for fast search across text, keywords, topic, subtopic
FiqhChunkSchema.index({
  text: "text",
  keywords: "text",
  topic: "text",
  subtopic: "text",
});

export default mongoose.models.FiqhChunk ||
  mongoose.model("FiqhChunk", FiqhChunkSchema);
