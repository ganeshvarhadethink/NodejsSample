const OrganizationService = require("../Services/OrganizationService");

exports.createOrganization = async (req, res) => {
  await OrganizationService.create(req.body)
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

exports.getOrganizations = async (req, res) => {
  console.log("get Organizations", req.query["filter"]);
  let filter = "";
  if (typeof req.query["filter"] !== "undefined") {
    filter = req.query.filter;
  }
  await OrganizationService.getAll(filter)
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

exports.getOrganization = async (req, res) => {
  console.log("req", req);
  await OrganizationService.get(req.params.id)
    .then((response) => {
      if (response !== null) {
        console.log("Res", response);
        res.send(response);
      } else {
        res.status(400).send({
          message: `Can not find Organization with given id ${req.params.id}. Organization was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};
exports.updateOrganization = async (req, res) => {
  await OrganizationService.update(req.params.id, req.body)
    .then((response) => {
      if (response !== null) {
        console.log("Res", response);
        res.send(response);
      } else {
        res.status(400).send({
          message: `Can not find Organization with given id ${req.params.id}. Organization was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};

exports.deleteOrganization = async (req, res) => {
  await OrganizationService.delete(req.params.id)
    .then((num) => {
      if (num == 1) {
        res.send({
          message: "Organization was deleted successfully!",
        });
      } else {
        res.status(400).send({
          message: `Can not delete Organization with given id ${req.params.id}. Organization was not found!`,
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        message: err.message || "Some error occurred while retrieving data.",
      });
    });
};
