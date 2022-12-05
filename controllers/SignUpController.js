const User = require("../models/User");
const handleNewUser = async (req, res) => {
  const { user, pswrd } = req.body;
  if (!user || !pswrd) return res.status(400);
};
