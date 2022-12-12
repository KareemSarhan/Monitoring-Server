const User = require("../models/User");
const Check = require("../models/Check");
const Report = require("../models/Report");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { intiateSingleContinousCheck } = require("../utils.js");
const { stopSingleContinousCheck } = require("../utils.js");

const handleAddCheck = async (req, res) => {
  const { user_id } = req.user;
  const existingCheck = await Check.findOne({
    name: req.body.name,
    user: user_id,
  });
  if (existingCheck) return res.status(400).send("Check already exists");
  const check = new Check({
    user: user_id,
    name: req.body.name,
    url: req.body.url,
    protocol: req.body.protocol,
    path: req.body.path,
    port: req.body.port,
    webhook: req.body.webhook,
    timeout: req.body.timeout,
    interval: req.body.interval * 1000,
    threshold: req.body.threshold,
    authentication: req.body.authentication,
    httpHeaders: req.body.httpHeaders,
    assert: req.body.assert,
    tags: req.body.tags,
    ignoreSSL: req.body.ignoreSSL,
  });
  try {
    await check.save();
    res.json({ Check: check.name, message: "Check added" });
    intiateSingleContinousCheck(check);
  } catch (err) {
    res.json({ message: err });
  }
};
const handleGetCheckById = async (req, res) => {
  const { user_id } = req.user;
  const check = await Check.findOne({
    _id: req.params.checkId,
    user: user_id,
  });
  if (!check) return res.status(400).send("Check not found");
  res.json(check);
};
const handleGetChecksByTag = async (req, res) => {
  const { user_id } = req.user;
  result = [];
  const checks = await Check.find({
    user: user_id,
  });
  for (let i = 0; i < checks.length; i++) {
    if (checks[i].tags.includes(req.params.tag)) {
      result.push(checks[i]);
    }
  }
  if (!checks) return res.status(400).send("Check not found");
  res.json(result);
};
const handleGetAllChecks = async (req, res) => {
  const { user_id } = req.user;
  const checks = await Check.find({
    user: user_id,
  });
  if (!checks) return res.status(400).send("no checks found");
  return res.json(checks);
};
const handleDeleteCheck = async (req, res) => {
  const { user_id } = req.user;
  const check = await Check.findOne({
    _id: req.params.checkId,
    user: user_id,
  });
  if (!check) return res.status(400).send("Check not found");
  try {
    stopSingleContinousCheck(check);
    const reports = await Report.deleteMany({
      check: check._id,
    });
    await check.remove();
    res.json({ message: "Check " + check.name + " deleted" });
  } catch (err) {
    res.json({ message: err });
  }
};
const handleUpdateCheck = async (req, res) => {
  const { user_id } = req.user;
  const check = await Check.findOne({
    _id: req.params.checkId,
    user: user_id,
  });
  if (!check) return res.status(400).send("Check not found");
  try {
    stopSingleContinousCheck(check);
    const newData = {};
    if (req.body.name) newData.name = req.body.name;
    if (req.body.url) newData.url = req.body.url;
    if (req.body.protocol) newData.protocol = req.body.protocol;
    if (req.body.path) newData.path = req.body.path;
    if (req.body.port) newData.port = req.body.port;
    if (req.body.webhook) newData.webhook = req.body.webhook;
    if (req.body.timeout) newData.timeout = req.body.timeout;
    if (req.body.interval) newData.interval = req.body.interval * 1000;
    if (req.body.threshold) newData.threshold = req.body.threshold;
    if (req.body.authentication)
      newData.authentication = req.body.authentication;
    if (req.body.httpHeaders) newData.httpHeaders = req.body.httpHeaders;
    if (req.body.assert) newData.assert = req.body.assert;
    if (req.body.tags) newData.tags = req.body.tags;
    if (req.body.ignoreSSL) newData.ignoreSSL = req.body.ignoreSSL;
    const updatedCheck = await check.updateOne({
      $set: newData,
    });
    res.json({ message: "Check " + check.name + " updated" });
    intiateSingleContinousCheck(check);
  } catch (err) {
    res.json({ message: err });
  }
};

module.exports = {
  handleAddCheck,
  handleGetCheckById,
  handleGetChecksByTag,
  handleGetAllChecks,
  handleDeleteCheck,
  handleUpdateCheck,
};
