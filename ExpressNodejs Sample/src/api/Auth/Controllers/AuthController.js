const AuthService = require("../Services/AuthService");

exports.signUp = async (req, res) => {
  await AuthService.signup(req.body)
    .then((response) => {
      console.log("Res", response);
      res.send(response);
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};

exports.login = async (req, res) => {
  return await AuthService.login(req.body)
    .then((response) => {
      console.log("Res", response);
      res.send(response);
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};

exports.sendOtp = async (req, res) => {
  return await AuthService.sendOtp(req.body)
    .then((response) => {
      console.log("Res", response);
      res.send({
        message: "Otp has been successfully send to your device.",
      });
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};

exports.verifyPhone = async function (req, res) {
  const verifyOtp = req.body.otp;
  return await AuthService.verifyOtp(req.body)
    .then((response) => {
      console.log("Res", response);
      if (response !== null) {
        if (verifyOtp == response.temprory_otp) {
          res.send({ message: "Phone successfully verified." });
        } else {
          res.status(400).send({ message: "User enters an incorrect otp." });
        }
      } else {
        res.status(400).send({
          message: "Phone number not registered for otp.",
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};

exports.sendMail = async (req, res) => {
  return await AuthService.sendMail(req.body)
    .then((response) => {
      console.log("Res", response);
      res.send(response);
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};

exports.verifyEmail = async (req, res) => {
  return await AuthService.verifyEmail(req.body)
    .then((response) => {
      console.log("Res", response);
      res.send({ Message: "Email Verified successfully." });
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};

exports.changePassword = async (req, res) => {
  return await AuthService.changePassword(req.body)
    .then((response) => {
      console.log("Res", response);
      res.send(response);
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};
