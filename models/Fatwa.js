import mongoose from 'mongoose';

const FatwaSchema = new mongoose.Schema({
  title: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  category: { type: String, required: true },
  tags: [{ type: String }],
  related: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Fatwa' }],
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Fatwa || mongoose.model('Fatwa', FatwaSchema);