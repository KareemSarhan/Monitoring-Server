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
const DeleteUserController = require("./controllers/deleteUserController");
const { intiateContinuousCheck } = require("./utils");
const CheckController = require("./controllers/checkController");
const ReportController = require("./controllers/reportController");

//user routes
app.delete("/deleteUser", DeleteUserController.handleDeleteUser);
app.post("/signUp", SignUpController.handleNewUser);
app.get("/verfy/:uniqueString", SignUpController.handleVerfication);
app.post("/signIn", SignInController.handleSignIn);

//checks routes
app.post("/addCheck", auth, CheckController.handleAddCheck);
app.get("/getAllChecks", auth, CheckController.handleGetAllChecks);
app.get("/getCheck/:checkId", auth, CheckController.handleGetCheckById);
app.get("/getChecks/:tag", auth, CheckController.handleGetChecksByTag);
app.delete("/deleteCheck/:checkId", auth, CheckController.handleDeleteCheck);
app.put("/updateCheck/:checkId", auth, CheckController.handleUpdateCheck);

//reports routes
app.get(
  "/getCheckReport/:checkId",
  auth,
  ReportController.handleGetReportsByCheckId
);
app.get("/getCheckReports/:tag", auth, ReportController.handleGetReportsByTag);

app.get("/", (req, res) => {
  res.send("Hello World!");
});
try {
  intiateContinuousCheck();
  console.log("Continuous Check Started ");
} catch (err) {
  console.log(err);
}

module.exports = app;
