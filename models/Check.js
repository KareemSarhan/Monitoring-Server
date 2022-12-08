const mongoose = require("mongoose");
const { boolean } = require("webidl-conversions");
const Schema = mongoose.Schema;

// - `name`: The name of the check.
// - `url`: The URL to be monitored.
// - `protocol`: The resource protocol name `HTTP`, `HTTPS`, or `TCP`.
// - `path`: A specific path to be monitored *(optional)*.
// - `port`: The server port number *(optional)*.
// - `webhook`: A webhook URL to receive a notification on *(optional)*.
// - `timeout` *(defaults to 5 seconds)*: The timeout of the polling request *(optional)*.
// - `interval` *(defaults to 10 minutes)*: The time interval for polling requests *(optional)*.
// - `threshold` *(defaults to 1 failure)*: The threshold of failed requests that will create an alert *(optional)*.
// - `authentication`: An HTTP authentication header, with the Basic scheme, to be sent with the polling request *(optional)*.
//   - `authentication.username`
//   - `authentication.password`
// - `httpHeaders`: A list of key/value pairs custom HTTP headers to be sent with the polling request (optional).
// - `assert`: The response assertion to be used on the polling response (optional).
//   - `assert.statusCode`: An HTTP status code to be asserted.
// - `tags`: A list of the check tags (optional).
// - `ignoreSSL`: A flag to ignore broken/expired SSL certificates in case of using the HTTPS protocol.

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
});

module.exports = mongoose.model("Check", UserSchema);
