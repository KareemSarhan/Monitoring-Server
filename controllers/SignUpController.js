const User = require("../models/User");
const Verfication = require("../models/Verfication");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const transporter = require("../config/nodemailer");

const handleNewUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(400);
  if (await User.findOne({ email: email }).exec()) return res.sendStatus(234);
  encryptedPassword = await bcrypt.hash(password, 10);

  await User.create({
    email: email.toLowerCase(),
    password: encryptedPassword,
  }).then(async (result) => {
    const uniqueString = (await uuidv4()) + 123;
    await Verfication.create({
      uniqueString: uniqueString,
      Id: result._id,
    });
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify Your Email",
      text: `go to http://localhost:3000/Verfy/${uniqueString}`,
    };
    transporter.sendMail(mailOptions);
  });

  return res.sendStatus(200);
};
const handleVerfication = async (req, res) => {
  let { uniqueString } = req.params;
  const ver = await Verfication.findOne({ uniqueString: uniqueString }).exec();
  if (!ver) return res.sendStatus(404);
  const user = await User.findByIdAndUpdate(
    { _id: ver.Id },
    { verficationState: true }
  );
  return res.sendStatus(200);
};

module.exports = { handleNewUser, handleVerfication };
