import mongoose from "mongoose";

const metricSchema = new mongoose.Schema({
  name: String,
  value: Number,
  category: {
    type: String,
    default: "General",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default mongoose.model("Metric", metricSchema);
