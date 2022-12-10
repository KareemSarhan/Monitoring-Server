const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ReportSchema = new Schema({
  check: {
    type: Schema.Types.ObjectId,
    ref: "Check",
    required: true,
  },
  result: {
    type: String,
    required: true,
  },
  status: {
    type: Number,
    required: true,
  },
  responseTime: {
    type: Number,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Report", ReportSchema);
