let authRepo = require("../Repositories/AuthRepo");

exports.signupUser = async (email, password) => {
  return await authRepo.signupUser(email, password);
};

exports.loginUser = async (event) => {
  return await authRepo.loginUser(event);
};

exports.forgotPassword = async (event) => {
  return await authRepo.forgotPassword(event);
};

exports.confirmPassword = async (event) => {
  return await authRepo.confirmPassword(event);
};
