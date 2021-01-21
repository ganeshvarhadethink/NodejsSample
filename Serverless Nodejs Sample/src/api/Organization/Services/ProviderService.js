const ProviderRepo = require("../Repositories/ProviderRepo");
const userService = require("../../User/Services/UserService");

exports.createOrganization = async (event) => {
  console.log(":EVENT RECEIVED: ", event);
  let provider_details = event.provider_det;
  let admin_details = event.admin_details;

  let pro_response = await ProviderRepo.createProvider(provider_details);
  console.log("PRO RESPONSE: ", pro_response);
  if (pro_response[1]) {
    admin_details.organization_id = pro_response[0].dataValues.id;
    console.log("New Provider in Service");
  } else {
    admin_details = null;
    console.log("OLD");
  }

  return admin_details;
};

exports.updateProviderServ = async (event) => {
  return await ProviderRepo.updateProvider(event);
  //let add_update = await AddressRepo.updateAddress(event);
  //console.log("add_update: ", add_update);
};

exports.deleteProvider = async (event) => {
  let pro_delete = await ProviderRepo.deleteProvider(event);
  console.log("pro_delete: ", pro_delete);

  let del_user = userService.deleteUserByOrg(event);
  return del_user;
};

exports.getProviderById = async (event) => {
  return await ProviderRepo.getProviderById(event);
};

exports.getOrgByStatus = async (event) => {
  return await ProviderRepo.getOrgByStatus(event);
};

exports.getActiveCountforOrg = async (event) => {
  return await ProviderRepo.getActiveCountforOrg(event);
};
