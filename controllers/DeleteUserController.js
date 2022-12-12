User = require("../models/User");
const Check = require("../models/Check");
const { stopSingleContinousCheck } = require("../utils.js");
const Report = require("../models/Report");

bcrypt = require("bcryptjs");
// remove user and all his checks and all thier reports
const handleDeleteUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(400);
  const removedUser = await User.findOne({ email: email.toLowerCase() });
  if (!removedUser) return res.status(400).send("User not found");
  if (!(await bcrypt.compare(password, removedUser.password)))
    return res.status(400).send("Invalid Credentials");
  const checks = await Check.find({
    user: removedUser._id,
  });
  if (!checks) return res.status(400).send("Checks not found");
  for (let i = 0; i < checks.length; i++) {
    stopSingleContinousCheck(checks[i]);
  }

  for (let i = 0; i < checks.length; i++) {
    const reports = await Report.find({
      checkId: checks[i]._id,
    });
    for (let j = 0; j < reports.length; j++) {
      await reports[j].remove();
    }
    await checks[i].remove();
  }
  try {
    await removedUser.remove();
    res.json({ User: removedUser, message: "User removed" });
  } catch (err) {
    res.json({ message: err });
  }
};

module.exports = {
  handleDeleteUser,
};
