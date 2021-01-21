global.fetch = require("node-fetch");
require("dotenv").config();
let UserService = require("../Services/UserService");

exports.createUser = async (event) => {
  let user_details = JSON.parse(event.body);
  console.log("EVENT: ", user_details);
  let create_response = await UserService.createUser(user_details);
  console.log("USER_CREATE RESPONSE: ", create_response);
  return create_response;
};

exports.getUserById = async (event) => {
  console.log("EVENT: ", event);
  let email = event.queryStringParameters.email_id;
  console.log("EVENT: ", email);
  return await UserService.getUserById(email);
};

exports.getAllUsers = async (event) => {
  return await UserService.getAllUsers(event);
};

exports.getAdmin = async (event) => {
  return await UserService.getAdmin(event);
};

exports.deleteUser = async (event) => {
  console.log("EVENT: ", event);
  let user = JSON.parse(event.body);
  let delete_response = await UserService.deleteUser(user);
  console.log("USER_DELETE RESPONSE: ", delete_response);
  return delete_response;
};

exports.updateUser = async (event) => {
  console.log("EVENT: ", event);
  let user_id = JSON.parse(event.body);
  let delete_response = await UserService.updateUser(user_id);
  console.log("USER_UPDATE RESPONSE: ", delete_response);
  return delete_response;
};

exports.getUserByStatus = async (event) => {
  return await UserService.getUserByStatus(event);
};
