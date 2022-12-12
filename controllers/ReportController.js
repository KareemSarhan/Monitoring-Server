const User = require("../models/User");
const Check = require("../models/Check");
const Report = require("../models/Report");

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
  Curruntstatus = 0;
  availability = 0;
  outages = 0;
  downtime = 0;
  uptime = 0;
  averageResponseTime = 0;
  newestReportDate = reports[0].createdAt;
  for (let i = 0; i < reports.length; i++) {
    if (reports[i].createdAt > newestReportDate) {
      newestReportDate = reports[i].createdAt;
      Curruntstatus = reports[i].status;
    }

    if (reports[i].status != 200) {
      outages++;
      downtime += reports[i].responseTime * check.frequency;
    } else reports[i].status == 200;
    {
      uptime += reports[i].responseTime * check.frequency;
    }
    averageResponseTime += reports[i].responseTime;
  }
  averageResponseTime = averageResponseTime / reports.length;
  availability = (uptime / (uptime + downtime)) * 100;
  const result = {
    Curruntstatus,
    availability,
    outages,
    downtime,
    uptime,
    responseTime,
    history: reports,
  };
  return res.json(result);
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
  handleGetReportsByCheckId,
  handleGetReportsByTag,
};
