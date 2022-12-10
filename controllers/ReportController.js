const User = require("../models/User");
const Check = require("../models/Check");
const Report = require("../models/Report");
const axios = require("axios");

const intiateContinuousCheck = async () => {
  numberOfChecks = 0;
  const checks = await Check.find();
  if (!checks) return console.log("No checks found to track");
  checks.forEach((check) => {
    numberOfChecks++;
    setInterval(async () => {
      const result = await axios.get(check.url);
      const report = new Report({
        checkId: check._id,
        result: result.data,
        status: result.status,
        responseTime: result.responseTime,
      });
      await report.save();
    }, check.frequency).then((intervalId) => {
      check.intervalId = intervalId;
    });
    check.save();
  });
  return console.log("Number of checks being tracked : " + numberOfChecks);
};

const intiateSingleContinousCheck = async (checkId) => {
  const check = await Check.findOne({
    _id: checkId,
  });
  if (!check) return res.status(400).send("Check not found");
  setInterval(async () => {
    const result = await axios.get(check.url);
    const report = new Report({
      checkId: check._id,
      result: result.data,
      status: result.status,
      responseTime: result.responseTime,
    }).then((intervalId) => {
      check.intervalId = intervalId;
    });
    await report.save();
  }, check.frequency);
  check.save();
};

const stopSingleContinousCheck = async (checkId) => {
  const check = await Check.findOne({
    _id: checkId,
  });
  if (!check) return res.status(400).send("Check not found");
  clearInterval(check.intervalId);
};

const handleGetReportsByCheckId = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email.toLowerCase(),
  });
  const check = await Check.findOne({
    _id: req.params.checkId,
    owner: user._id,
  });
  if (!check) return res.status(400).send("Check not found");
  const reports = await Report.find({
    checkId: check._id,
  });
  if (!reports) return res.status(400).send("Reports not found");
  res.json(reports);
};
const handleGetReportsByTag = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({
    email: email.toLowerCase(),
  });
  const checks = await Check.find({
    owner: user._id,
  }).filter((check) => check.tags.includes(req.params.tag));
  if (!checks) return res.status(400).send("Check not found");
  const reports = await Report.find({
    checkId: checks._id,
  });
  if (!reports) return res.status(400).send("Reports not found");
  res.json(reports);
};

module.exports = {
  intiateContinuousCheck,
  intiateSingleContinousCheck,
  stopSingleContinousCheck,
  handleGetReportsByCheckId,
  handleGetReportsByTag,
};
