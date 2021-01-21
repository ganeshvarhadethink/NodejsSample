let AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
global.fetch = require("node-fetch");
var cognitoServiceProvider = new AWS.CognitoIdentityServiceProvider();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
require("dotenv").config();
const model = require("../../../Database/dbconfig");

const poolData = {
  UserPoolId: process.env.UserPoolId,
  ClientId: process.env.ClientId,
};
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
let cognitoUser;

exports.signup = async (data) => {
  let email = data.email;
  let password = data.password;
  let phone_number = data.mobile_number;
  var userData = {
    Username: email,
    Pool: userPool,
  };
  cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  var params = {
    ClientId: process.env.ClientId,
    Username: email,
    Password: password,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "phone_number",
        Value: phone_number,
      },
    ],
  };
  return await cognitoServiceProvider.signUp(params).promise();
};

exports.login = async (data) => {
  let userData = {
    Username: data.email,
    Pool: userPool,
  };
  cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: data.email,
    Password: data.password,
  });
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        resolve(result);
      },
      onFailure: function (err) {
        reject(err);
      },
    });
  });
};

exports.sendOtp = async (data) => {
  const secretLoginCode = Date.now().toString().slice(-4);
  let response;
  const params = {
    Message: secretLoginCode /* required */,
    PhoneNumber: data.mobile_number,
    MessageAttributes: {
      "AWS.SNS.SMS.SMSType": {
        DataType: "String",
        StringValue: "Transactional",
      },
    },
  };
  await new AWS.SNS({ apiVersion: "2010-03-31" })
    .publish(params)
    .promise()
    .then((res) => {
      return model.User.update(
        { temprory_otp: secretLoginCode },
        {
          returning: true,
          plain: true,
          where: { mobile_number: data.mobile_number },
        }
      );
    })
    .then((user) => {
      response = user;
    })
    .catch((err) => {
      response = err;
    });
  return response;
};

exports.verifyOtp = async (data) => {
  return await model.User.findOne({
    where: {
      mobile_number: data.mobile_number,
    },
    attributes: ["temprory_otp", "mobile_number"],
  });
};

exports.sendMail = async (event) => {
  console.log("Event ", event);
  if (event.triggerSource === "CustomMessage_SignUp") {
    const { codeParameter } = event.request;
    const { userName, region } = event;
    const { clientId } = event.callerContext;
    const { email } = event.request.userAttributes;
    const url = "https://dev.dashboard.^^^^.com/mobile-verification";
    const link = `<a href="${url}?code=${codeParameter}&username=${userName}&clientId=${clientId}&region=${region}&email=${email}" target="_blank">here</a>`;
    event.response.emailSubject = "Your verification link";
    event.response.emailMessage = `Thank you for signing up. Click ${link} to verify your email.`;
  }
  return event;
};

exports.verifyEmail = async (data) => {
  const params = {
    ClientId: data.clientId,
    ConfirmationCode: data.code,
    Username: data.username,
  };
  return await cognitoServiceProvider.confirmSignUp(params).promise();
};

exports.changePassword = async (data) => {
  var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: data.username,
    Password: data.password,
  });
  var userData = {
    Username: data.username,
    Pool: userPool,
  };
  var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        cognitoUser.changePassword(
          data.password,
          data.newpassword,
          (err, result) => {
            if (err) {
              reject(err);
            } else {
              resolve({ Message: "Password successfully changed." });
            }
          }
        );
      },
      onFailure: function (err) {
        reject(err);
      },
    });
  });
};
