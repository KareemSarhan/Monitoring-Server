const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const handleAddCheck = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });
  const existingCheck = await Check.findOne({
    name: req.body.name,
    owner: user._id,
  });
  if (existingCheck) return res.status(400).send("Check already exists");
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
const handleGetCheckById = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email.toLowerCase(),
  });
  const check = await Check.findOne({
    _id: req.params.checkId,
    owner: user._id,
  });
  if (!check) return res.status(400).send("Check not found");
  res.json(check);
};
const handleGetChecksByTag = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email.toLowerCase(),
  });
  //check if check contains the requested tag
  const checks = await Check.find({
    owner: user._id,
  }).filter((check) => check.tags.includes(req.params.tag));
  if (!checks) return res.status(400).send("Check not found");
  res.json(checks);
};
const hadleDeleteCheck = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email.toLowerCase(),
  });
  const check = await Check.findOne({
    _id: req.params.checkId,
    owner: user._id,
  });
  if (!check) return res.status(400).send("Check not found");
  try {
    const removedCheck = await check.remove();
    res.json(removedCheck);
  } catch (err) {
    res.json({ message: err });
  }
};
const handleUpdateCheck = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email.toLowerCase(),
  });
  const check = await Check.findOne({
    _id: req.params.checkId,
    owner: user._id,
  });
  if (!check) return res.status(400).send("Check not found");
  try {
    const updatedCheck = await check.updateOne({
      $set: {
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
      },
    });
    res.json(updatedCheck);
  } catch (err) {
    res.json({ message: err });
  }
};

module.exports = {
  handleAddCheck,
  handleGetCheckById,
  handleGetChecksByTag,
  hadleDeleteCheck,
  handleUpdateCheck,
};
