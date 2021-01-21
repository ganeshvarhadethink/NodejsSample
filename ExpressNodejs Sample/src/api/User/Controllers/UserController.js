const UserService = require("../Services/UserService");

exports.createUser = async (req, res) => {
  await UserService.create(req.body)
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

exports.getUsers = async (req, res) => {
  console.log("get users");
  await UserService.getAll()
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

exports.getUser = async (req, res) => {
  console.log("req", req);
  await UserService.get(req.params.email)
    .then((response) => {
      if (response !== null) {
        console.log("Res", response);
        res.send(response);
      } else {
        res.status(400).send({
          message: `Can not find User with given email ${req.params.email}. User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};
exports.updateUser = async (req, res) => {
  await UserService.update(req.params.id, req.body)
    .then((response) => {
      console.log("Res", response);
      if (response !== null) {
        res.send(response);
      } else {
        res.status(400).send({
          message: `Can not find User with given id ${req.params.id}. User was not found!`,
        });
      }
    })
    .catch((err) => {
      console.log("errr", err);
      res.status(400).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};

exports.deleteUser = async (req, res) => {
  await UserService.delete(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "User was deleted successfully!",
        });
      } else {
        res.status(400).send({
          message: `Can not delete User with given id ${req.params.id}. User was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};
