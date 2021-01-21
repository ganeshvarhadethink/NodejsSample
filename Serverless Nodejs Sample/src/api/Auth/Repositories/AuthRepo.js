let AWS = require("aws-sdk");
let cognitoServiceProvider = new AWS.CognitoIdentityServiceProvider();
const AmazonCognitoIdentity = require("amazon-cognito-identity-js");
global.fetch = require("node-fetch");
require("dotenv").config();
const reply = require("../../../resources/utils");

const poolData = {
  UserPoolId: process.env.UserPoolId,
  ClientId: process.env.ClientId,
};

const pool_region = process.env.pool_region;
console.log("POOLDATA: ", poolData);
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

let cognitoUser;

exports.signupUser = async (email, password) => {
  console.log("CREDS RECEIVED IN SUP COG FUNC:", email, " ", password);

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
    ],
  };
  console.log("PARAMS: ", params);
  return new Promise((resolve, reject) => {
    cognitoServiceProvider.signUp(params, (err, data) => {
      if (err) {
        console.log("ERROR CREATING NEW USER IN COGNITO: ", err.message);
        reject(
          (response = {
            statusCode: 403,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "*",
              "Content-Type": "application/json",
              "Access-Control-Allow-Headers": "*",
              "Access-Control-Allow-Credentials": true,
              preflightContinue: true,
            },
            body: JSON.stringify(err.message),
          })
        );
      } else {
        console.log("NEW USER CREATED IN COGNITO: ", data);
        resolve(
          (response = {
            statusCode: 200,
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "*",
              "Content-Type": "application/json",
              "Access-Control-Allow-Headers": "*",
              "Access-Control-Allow-Credentials": true,
              preflightContinue: true,
            },
            body: JSON.stringify(data),
          })
        );
      }
    });
  });
};

exports.loginUser = async (event) => {
  console.log("EVENT IN LR : ", event);
  let email = event.email_id;
  let password = event.password;
  let role = event.role;
  let res = {};
  let userData = {
    Username: email,
    Pool: userPool,
  };
  cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
  let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
    Username: email,
    Password: password,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function (result) {
        console.log("access token + " + result.getAccessToken().getJwtToken());
        console.log("id token + " + result.getIdToken().getJwtToken());
        console.log("refresh token + " + result.getRefreshToken().getToken());
        res.tokens = result;
        res.role = role;
        resolve(reply.replyToApi(JSON.stringify(res), 200));
      },
      onFailure: function (err) {
        let message = JSON.stringify(err.message);
        console.log("Login Error: ", message);
        reject(
          reply.replyToApi(JSON.stringify({ message: "Loggin Error" }), 200)
        );
      },
      newPasswordRequired: function (userAttributes) {
        delete userAttributes.email_verified;
        cognitoUser.completeNewPasswordChallenge(
          password,
          userAttributes,
          this
        );
      },
    });
  });
};

exports.forgotPassword = async (event) => {
  let inputObject = JSON.parse(event.body);

  cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: inputObject.email,
    Pool: userPool,
  });

  return await new Promise((resolve, reject) => {
    cognitoUser.forgotPassword({
      onSuccess: function (result) {
        console.log("RESULT:  " + result);
        resolve(reply.replyToApi(JSON.stringify(result), 200));
      },
      onFailure: function (err) {
        let message = JSON.stringify(err.message);
        console.log("Login Error: ", message);
        reject(
          reply.replyToApi(JSON.stringify({ message: "Loggin Error" }), 200)
        );
      },
    });
  });
};

exports.confirmPassword = async (event) => {
  let inputObject = JSON.parse(event.body);
  cognitoUser = new AmazonCognitoIdentity.CognitoUser({
    Username: inputObject.username,
    Pool: userPool,
  });

  const params = {
    ClientId: inputObject.clientId,
    ConfirmationCode: inputObject.code,
    Username: inputObject.username,
    Password: inputObject.newPassword,
  };

  return await new Promise((resolve, reject) => {
    cognitoServiceProvider.confirmForgotPassword(params, (err, res) => {
      if (err) {
        console.log("ERROR: ", err);
        resolve(reply.replyToApi(JSON.stringify(err), 400));
      } else {
        console.log("RES: ", res);
        resolve(reply.replyToApi(JSON.stringify(res), 200));
      }
    });
  });
};
