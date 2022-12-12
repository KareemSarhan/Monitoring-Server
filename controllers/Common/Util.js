const axios = require("axios");
const Check = require("../../models/Check");
const Report = require("../../models/Report");

var intervalIdDict = {};
var numberOfChecks = 0;
const intiateContinuousCheck = async () => {
  const checks = await Check.find();
  if (!checks) return console.log("No checks found to track");
  checks.forEach((check) => {
    intiateSingleContinousCheck(check);
  });
};

const intiateSingleContinousCheck = async (check) => {
  var setIntervalID = setInterval(async () => {
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

      const instance = axios.create();

      instance.interceptors.request.use((config) => {
        config.headers["request-startTime"] = new Date().getTime();
        return config;
      });

      instance.interceptors.response.use((response) => {
        const currentTime = new Date().getTime();
        const startTime = response.config.headers["request-startTime"];
        response.headers["request-duration"] = currentTime - startTime;
        return response;
      });
      result = await instance(axiosOptions);
      intervalIdDict = { ...intervalIdDict, [check._id]: setIntervalID };
    } catch (error) {
      console.log("setInterval error : ", error.name);
      console.log("setInterval error : ", error);
    }
    const report = await new Report({
      check: check._id,
      status: result ? result.status : -1,
      responseTime: result ? result.headers["request-duration"] : -1,
      result: result ? JSON.stringify(result.data) : "",
    });
    await report.save();
  }, check.interval);
  numberOfChecks++;
  console.log("Number of checks being tracked : " + numberOfChecks);
};

const stopSingleContinousCheck = async (check) => {
  clearInterval(intervalIdDict[check._id]);
  numberOfChecks--;
  console.log("Number of checks being tracked : " + numberOfChecks);
};
const stopAll = async () => {
  for (var key in intervalIdDict) {
    clearInterval(intervalIdDict[key]);
  }
  numberOfChecks = 0;
  console.log("Number of checks being tracked : " + numberOfChecks);
};

module.exports = {
  intiateContinuousCheck,
  intiateSingleContinousCheck,
  stopSingleContinousCheck,
  stopAll,
};
