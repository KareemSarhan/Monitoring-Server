const express = require("express");
const app = express();
const port = 3000;
const auth = require("./middleware/auth");
require("dotenv").config();

app.use(express.json());

const mongoose = require("./config/mongo").mongoose;

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
const SignUpController = require("./controllers/signUpController");
const SignInController = require("./controllers/signInController");

app.post("/signUp", SignUpController.handleNewUser);
app.get("/verfy/:uniqueString", SignUpController.handleVerfication);

app.post("/signIn", SignInController.handleSignIn);

const MonitorController = require("./controllers/monitorController");
const { intiateContinuousCheck } = require("./controllers/ReportController");
app.post("/addCheck", auth, MonitorController.handleAddCheck);
app.get("/getCheck/:checkId", auth, MonitorController.handleGetCheckById);
app.get("/getChecks/:tag", auth, MonitorController.handleGetChecksByTag);
app.delete("/deleteCheck/:checkId", auth, MonitorController.hadleDeleteCheck);
app.put("/updateCheck/:checkId", auth, MonitorController.handleUpdateCheck);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
try {
  intiateContinuousCheck();
  console.log("Continuous Check Started ");
} catch (err) {
  console.log(err);
}
