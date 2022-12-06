const express = require("express");
const app = express();
const port = 3000;
const auth = require("./middleware/auth");
require("dotenv").config();

app.use(express.json());

const mongoose = require("mongoose");
mongoose.connect(process.env.MongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
const SignUpController = require("./controllers/signUpController");
const SignInController = require("./controllers/signInController");

app.post("/signUp", SignUpController.handleNewUser);
app.get("/verfy/:uniqueString", SignUpController.handleVerfication);

app.post("/signIn", SignInController.handleSignIn);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
