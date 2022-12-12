const axios = require("axios");
const Check = require("./models/Check");
const Report = require("./models/Report");

var numberOfChecks = 0;
const intiateContinuousCheck = async () => {
  const checks = await Check.find();
  if (!checks) return console.log("No checks found to track");
  checks.forEach((check) => {
    intiateSingleContinousCheck(check);
  });
};

const intiateSingleContinousCheck = async (check) => {
  const asd = setInterval(async () => {
    console.log("Checking " + check.name);
    var result = undefined;
    try {
      var axiosOptions = {};
      axiosOptions.url = check.url;
      axiosOptions.method = "get";

      if (check.authentication) {
        axiosOptions.auth = check.authentication;
      }
      if (check.httpHeaders && check.httpHeaders.length > 0) {
        axiosOptions.headers = check.httpHeaders;
      }
      if (check.ignoreSSL) {
        axiosOptions.ignoreSSL = check.ignoreSSL;
      }
      if (check.timeout) {
        axiosOptions.timeout = check.timeout * 1000;
      }
      if (check.protocol) {
        axiosOptions.protocol = check.protocol;
      }
      if (check.path) {
        axiosOptions.path = check.path;
      }
      if (check.port) {
        axiosOptions.port = check.port;
      }

      result = await axios(axiosOptions);
    } catch (error) {
      console.log("axios error: ", error.name);
    }
    const report = await new Report({
      check: check._id,
      status: result ? result.status : 0,
      responseTime: result ? result.responseTime : 0,
      result: result ? JSON.stringify(result.data) : "",
    });
    await report.save();
  }, check.interval * 20000);
  check.intervalId = asd.asyncID;
  check.save();
  numberOfChecks++;
  console.log("Number of checks being tracked : " + numberOfChecks);
};

const stopSingleContinousCheck = async (check) => {
  clearInterval(check.intervalId);
  numberOfChecks--;
  console.log("Number of checks being tracked : " + numberOfChecks);
};
module.exports = {
  intiateContinuousCheck,
  intiateSingleContinousCheck,
  stopSingleContinousCheck,
};
