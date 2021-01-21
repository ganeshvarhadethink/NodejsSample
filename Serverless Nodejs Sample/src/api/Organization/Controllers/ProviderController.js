let AWS = require("aws-sdk");
global.fetch = require("node-fetch");
require("dotenv").config();
const model = require("../../../database/dbConfig");
const authController = require("../../Auth/Controllers/AuthController");
const providerService = require("../Services/ProviderService");
const addressService = require("../../Address/Services/AddressService");
const userService = require("../../User/Services/UserService");
const reply = require("../../../resources/utils");

exports.getAllProviders = async (event) => {
  let parent_id = event.queryStringParameters.organization_id;
  console.log("DATA IN STORE FUNC:", parent_id);
  return new Promise((resolve, reject) => {
    model.Organization.findAll({
      where: {
        parent_id: parent_id,
      },
    })
      .then((res) => {
        console.log("DB FETCH SUCCESS: ", res);
        const response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": true,
            preflightContinue: true,
          },
          body: JSON.stringify(res),
        };
        resolve(response);
      })
      .catch((err) => {
        console.log("DB FETCH ERROR", err);
        reject(err);
      });
  });
};

exports.createProvider = async (event) => {
  if (event.source === "serverless-plugin-warmup") {
    console.log("WarmUp - Lambda is warm!");
    return "Lambda is warm!";
  }
  console.log("EVENT: ", event);
  let event_body = JSON.parse(event.body);
  let business_details = event_body.business_details;
  let admin_details = event_body.admin_details;
  let signup_details;
  console.log("business_details: ", business_details);
  //Make an entry for address first
  let add_response = await addressService.createAddress(
    business_details,
    admin_details
  );
  console.log("ADDRESS RESPONSE: ", add_response);
  //Create organization
  let create_response = await providerService.createOrganization(add_response);
  console.log("CREATE RESPONSE: ", create_response);
  //Create admin for the above created organization
  if (create_response) {
    let new_user = await userService.createUser(create_response);
    console.log("NEW USER TO PASS TO AUTH: ", new_user);
    //Authenticate admin
    let response = await authController.signUp(new_user);
    console.log("SIGN UP RESPONSE: ", response);
    return response;
  } else {
    console.log("CREATE RESPONSE: ", create_response);
    return reply.replyToApi(
      JSON.stringify({ message: "Organization name already exists" }),
      409
    );
  }
};

exports.updateProvider = async (event) => {
  console.log("UPDATE EVENT: ", event);
  let data = JSON.parse(event.body);

  let update_response = await addressService.updateAddress(data);
  console.log("update_response : ", update_response);
  return await providerService.updateProviderServ(update_response);
};

exports.deleteProvider = async (event) => {
  console.log("DELETE EVENT: ", event);
  let data = JSON.parse(event.body);

  let delete_response = await providerService.deleteProvider(data);
  console.log("delete_response : ", delete_response);
  return delete_response;
};

exports.getProviderById = async (event) => {
  let org_id = event.queryStringParameters.organization_id;
  return await providerService.getProviderById(org_id);
};

exports.getOrgByStatus = async (event) => {
  return await providerService.getOrgByStatus(event);
};

exports.getActiveCountforOrg = async (event) => {
  return await providerService.getActiveCountforOrg(event);
};
