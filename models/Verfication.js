const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const VerficationSchema = new Schema({
  uniqueString: {
    type: String,
    required: true,
  },
  Id: { type: String, required: true },
  expireAt: { type: Date, expires: 3600 },
});

module.exports = mongoose.model("Verfication", VerficationSchema);
