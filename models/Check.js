const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const Schema = mongoose.Schema;
const CheckSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  url: { type: String, required: true },
  protocol: {
    type: String,
    enum: ["http:", "https:", "tcp:"],
    default: "http:",
  },
  path: {
    type: String,
    default: "/",
  },
  port: {
    type: Number,
  },
  webhook: {
    type: String,
  },
  timeout: {
    type: Number,
    default: 5,
  },
  interval: {
    type: Number,
    default: 600,
  },
  threshold: {
    type: Number,
    default: 1,
  },
  authentication: {
    username: {
      type: String,
    },
    password: {
      type: String,
    },
  },
  httpHeaders: [{ key: String, value: String }],
  assert: {
    statusCode: {
      type: Number,
    },
  },
  tags: [{ type: String }],
  ignoreSSL: {
    type: Boolean,
    required: true,
  },
  time: {
    type: Date,
    default: Date.now,
  },
  intervalId: {
    type: String,
  },
});

module.exports = mongoose.model("Check", CheckSchema);
