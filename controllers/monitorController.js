const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const handleAddCheck = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne;
  const check = new Check({
    owner: user._id,
    name: req.body.name,
    url: req.body.url,
    protocol: req.body.protocol,
    path: req.body.path,
    port: req.body.port,
    webhook: req.body.webhook,
    timeout: req.body.timeout,
    interval: req.body.interval,
    threshold: req.body.threshold,
    authentication: req.body.authentication,
    httpHeaders: req.body.httpHeaders,
    assert: req.body.assert,
    tags: req.body.tags,
    ignoreSSL: req.body.ignoreSSL,
  });
  try {
    const savedCheck = await check.save();
    res.json(savedCheck);
  } catch (err) {
    res.json({ message: err });
  }
};
module.exports = { handleAddCheck };
