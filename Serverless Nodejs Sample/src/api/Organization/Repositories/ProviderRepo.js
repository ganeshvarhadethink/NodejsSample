const model = require("../../../database/dbConfig");
const reply = require("../../../resources/utils");

exports.createProvider = async (provider_details) => {
  console.log("IN CREATE PRO REPO: ", provider_details);
  return new Promise((resolve, reject) => {
    model.Organization.findOrCreate({
      where: {
        business_name: provider_details.business_name,
      },
      defaults: provider_details,
    })
      .then((res) => {
        console.log("PROVIDER CREATED SUCCESSFULLY", res);
        let data = res[0];
        let isNew = res[1];
        console.log("DATA: ", data, " : isNew", isNew);
        resolve(res);
      })
      .catch((err) => {
        console.log("ERROR CREATING NEW PROVIDER", err);
        reject(err);
      });
  });
};

exports.updateProvider = async (event) => {
  return new Promise((resolve, reject) => {
    model.Organization.update(event, {
      where: {
        id: event.id,
      },
    })
      .then((res) => {
        console.log("Provider Update Success: ", res[0]);
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
            body: "Record updated successfully",
          })
        );
      })
      .catch((err) => {
        console.log("Provider Update Error: ", err);
        reject(err);
      });
  });
};

exports.deleteProvider = async (event) => {
  console.log("DELETE EVENT:", event);
  return new Promise((resolve, reject) => {
    model.Organization.update(
      { status: "Inactive" },
      {
        where: {
          id: event.id,
        },
      }
    )
      .then((res) => {
        console.log("Provider Update Success: ", res[0]);
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
            body: "Record deleted successfully",
          })
        );
      })
      .catch((err) => {
        console.log("Provider delete Error: ", err);
        reject(err);
      });
  });
};

exports.getProviderById = async (org_id) => {
  return new Promise((resolve, reject) => {
    model.Organization.findOne({
      where: {
        id: org_id,
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

exports.getOrgByStatus = async (event) => {
  let parent_id = event.queryStringParameters.organization_id;
  let status = event.queryStringParameters.status;

  console.log("DATA IN STORE FUNC:", parent_id);
  return new Promise((resolve, reject) => {
    model.Organization.findAll({
      where: {
        parent_id: parent_id,
        status: status,
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

exports.getActiveCountforOrg = async (event) => {
  let organization_id = event.queryStringParameters.organization_id;
  let response = {};
  let deviceCount = await getDeviceActiveCount(organization_id);
  let locationCount = await getLocationActiveCount(organization_id);
  let endpointCount = await getEndpointActiveCount(organization_id);
  let orgCount = await getOrgActiveCount(organization_id);
  let userCount = await getUserActiveCount(organization_id);
  response = {
    deviceCount,
    locationCount,
    endpointCount,
    orgCount,
    userCount,
  };

  return reply.replyToApi(JSON.stringify(response), 200);
};

function getEndpointActiveCount(organization_id) {
  return new Promise((resolve, reject) => {
    model.Endpoint.count({
      where: {
        organization_id: organization_id,
        status: "Active",
      },
    })
      .then((res) => {
        console.log("RESPONSE: ", res);
        resolve(res);
      })
      .catch((err) => {
        console.log("ERROR: ", err);
        reject(err);
      });
  });
}

function getDeviceActiveCount(organization_id) {
  return new Promise((resolve, reject) => {
    model.Device.count({
      where: {
        status: "Active",
        [model.Sequelize.Op.or]: [
          {
            organization_id: organization_id,
          },
          {
            customer_id: organization_id,
          },
          {
            parent_id: organization_id,
          },
        ],
      },
    })
      .then((res) => {
        console.log("RESPONSE: ", res);
        resolve(res);
      })
      .catch((err) => {
        console.log("ERROR: ", err);
        reject(err);
      });
  });
}

function getLocationActiveCount(organization_id) {
  return new Promise((resolve, reject) => {
    model.DeviceLocation.count({
      where: {
        organization_id: organization_id,
        status: "Active",
      },
    })
      .then((res) => {
        console.log("RESPONSE: ", res);
        resolve(res);
      })
      .catch((err) => {
        console.log("ERROR: ", err);
        reject(err);
      });
  });
}

function getOrgActiveCount(organization_id) {
  return new Promise((resolve, reject) => {
    model.Organization.count({
      where: {
        parent_id: organization_id,
        status: "Active",
      },
    })
      .then((res) => {
        console.log("RESPONSE: ", res);
        resolve(res);
      })
      .catch((err) => {
        console.log("ERROR: ", err);
        reject(err);
      });
  });
}

function getUserActiveCount(organization_id) {
  return new Promise((resolve, reject) => {
    model.User.count({
      where: {
        organization_id: organization_id,
        status: "Active",
      },
    })
      .then((res) => {
        console.log("RESPONSE: ", res);
        resolve(res);
      })
      .catch((err) => {
        console.log("ERROR: ", err);
        reject(err);
      });
  });
}
