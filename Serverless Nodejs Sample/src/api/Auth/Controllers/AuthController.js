let authService = require("../Services/AuthService");
let userService = require("../../User/Services/UserService");
let AWS = require("aws-sdk");
let cognitoServiceProvider = new AWS.CognitoIdentityServiceProvider();

exports.signUp = async (event) => {
  console.log("EVENT IN SIGNUP:", event.body);
  let data = JSON.parse(event.body);
  let email = data.email_id;
  let password = data.password;

  return await authService.signupUser(email, password);
};

exports.login = async (event) => {
  console.log("EVENT IN LOGIN:", event);
  let data = JSON.parse(event.body);
  let email = data.email_id;
  let password = data.password;
  let response;

  let user = await userService.getUserStatus(email);
  console.log(
    "IN AUTH CON STATUS: ",
    user.dataValues.status,
    " : ",
    user.dataValues.role
  );
  if (user.dataValues.status === "Active") {
    data.role = user.dataValues.role;
    return await authService.loginUser(data);
  } else {
    response = {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": true,
        preflightContinue: true,
      },
      body: JSON.stringify({ message: "User is Deactivated by Orgnization" }),
    };
    console.log("RESP IN FAIL:", response);
    return response;
  }
};

//Send verification link to user's emailID
exports.sendMail = (event, context, callback) => {
  console.log("event", JSON.stringify(event));
  // Identify why was this function invoked
  if (event.triggerSource === "CustomMessage_SignUp") {
    // Ensure that your message contains event.request.codeParameter. This is the placeholder for code that will be sent
    const { codeParameter } = event.request;
    const { userName, region } = event;
    const { clientId } = event.callerContext;
    const { email } = event.request.userAttributes;
    const url = "https://app.^^^^.com/login";
    const link = `<a href="${url}?code=${codeParameter}&username=${userName}&clientId=${clientId}&region=${region}&email=${email}" target="_blank">here</a>`;
    event.response.emailSubject = "Your verification link"; // event.request.codeParameter
    event.response.emailMessage = `Thank you for signing up. Click ${link} to verify your email.`;
  }
  if (event.triggerSource === "CustomMessage_ForgotPassword") {
    // Ensure that your message contains event.request.codeParameter. This is the placeholder for code that will be sent
    const { codeParameter } = event.request;
    const { userName, region } = event;
    const { clientId } = event.callerContext;
    const { email } = event.request.userAttributes;
    const url = "https://app.^^^^.com/auth/change-password";
    const link = `<a href="${url}?code=${codeParameter}&username=${userName}&clientId=${clientId}&region=${region}&email=${email}" target="_blank">here</a>`;
    event.response.emailSubject = "Your password reset link"; // event.request.codeParameter
    event.response.emailMessage = `Click ${link} to reset the password.`;
  }

  // Return to Amazon Cognito
  callback(null, event);
};
//Verify user in Cognito
exports.verifyEmail = async (event) => {
  console.log("Event", event);
  const data = JSON.parse(event.body);
  const params = {
    ClientId: data.clientId,
    ConfirmationCode: data.code,
    Username: data.username,
  };

  try {
    await cognitoServiceProvider.confirmSignUp(params).promise();
    return (response = {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "*",
        "Content-Type": "application/json",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Credentials": true,
        preflightContinue: true,
      },
      body: JSON.stringify({ msg: "Email Verified successfully." }),
    });
  } catch (error) {
    return (response = { statusCode: 400, body: JSON.stringify(error) });
  }
};

exports.forgotPassword = async (event) => {
  console.log("EVENT: ", event);
  if (event.source === "serverless-plugin-warmup") {
    console.log("WarmUp - Lambda is warm!");
    return "Lambda is warm!";
  }
  return await authService.forgotPassword(event);
};

exports.confirmPassword = async (event) => {
  return await authService.confirmPassword(event);
};
