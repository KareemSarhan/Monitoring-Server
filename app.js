const express = require("express");
const app = express();
const port = 3000;
const User = require("./models/User");
require("dotenv").config();
const nodeMailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.get("/verfy/:uniqueString", async (req, res) => {
  let { uniqueString } = req.params;
  const ver = await Verfication.findOne({ uniqueString: uniqueString }).exec();
  if (!ver) return res.sendStatus(404);
  const user = await User.findByIdAndUpdate(
    { _id: ver.Id },
    { verficationState: true }
  );
  return res.sendStatus(200);
});

let transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MyMail,
    pass: process.env.MyPass,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Mailing service ready.");
  }
});
app.get("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.sendStatus(400);
  //if (await User.findOne({ email: email }).exec()) return res.sendStatus(234);
  await User.create({
    email: email,
    password: password,
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
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

const mongoose = require("mongoose");
const Verfication = require("./models/Verfication");
const { findOne } = require("./models/Verfication");
mongoose.connect(process.env.MongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
