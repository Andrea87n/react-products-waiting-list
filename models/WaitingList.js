import mongoose from "mongoose";

const WaitingListSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.WaitingList ||
  mongoose.model("WaitingList", WaitingListSchema);
