const userRepo = require("../Repositories/UserRepo");

exports.createUser = async (event) => {
  return await userRepo.createUser(event);
};

exports.deleteUserByOrg = async (event) => {
  return await userRepo.deleteUserByOrg(event);
};

exports.deleteUser = async (event) => {
  return await userRepo.deleteUser(event);
};

exports.getUserStatus = async (event) => {
  return await userRepo.getUserStatus(event);
};

exports.getUserById = async (event) => {
  return await userRepo.getUserById(event);
};

exports.getAllUsers = async (event) => {
  return await userRepo.getAllUsers(event);
};

exports.getAdmin = async (event) => {
  return await userRepo.getAdmin(event);
};

exports.updateUser = async (event) => {
  return await userRepo.updateUser(event);
};

exports.getUserByStatus = async (event) => {
  return await userRepo.getUserByStatus(event);
};
