const model = require("../../../database/dbConfig");
const reply = require("../../../resources/utils");

exports.createUser = async (admin_details) => {
  console.log(":EVENT RECEIVED: ", admin_details);
  return new Promise((resolve, reject) => {
    model.User.create(admin_details)
      .then((res) => {
        console.log("NEW USER CREATED..", res);
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
            body: JSON.stringify(res.dataValues),
          })
        );
      })
      .catch((err) => {
        console.log("ERROR CREATING NEW USER", err);
        reject(err);
      });
  });
};

exports.deleteUserByOrg = async (event) => {
  return new Promise((resolve, reject) => {
    model.User.update(
      { status: "Inactive" },
      {
        where: {
          organization_id: event.id,
        },
      }
    )
      .then((res) => {
        console.log("User delete Success: ", res[0]);
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
            body: "User deleted successfully",
          })
        );
      })
      .catch((err) => {
        console.log("Record Update Error: ", err);
        reject(err);
      });
  });
};

exports.deleteUser = async (event) => {
  return new Promise((resolve, reject) => {
    model.User.update(
      { status: "Inactive" },
      {
        where: {
          id: event.id,
        },
      }
    )
      .then((res) => {
        console.log("User delete Success: ", res[0]);
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
            body: "User deleted successfully",
          })
        );
      })
      .catch((err) => {
        console.log("User Update Error: ", err);
        reject(err);
      });
  });
};

exports.getUserStatus = async (email) => {
  return new Promise((resolve, reject) => {
    model.User.findOne({
      where: { email_id: email },
    })
      .then((res) => {
        console.log("STATUS RESPONSE: ", res);
        resolve(res);
      })
      .catch((err) => {
        console.log("GET STATUS ERROR: ", err);
        reject(err);
      });
  });
};

exports.getUserById = async (email) => {
  let response;
  return new Promise((resolve, reject) => {
    model.User.findOne({
      where: { email_id: email },
    })
      .then((res) => {
        console.log("STATUS RESPONSE: ", res);
        response = {
          statusCode: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "*",
            "Content-Type": "application/json",
            "Access-Control-Allow-Headers": "*",
            "Access-Control-Allow-Credentials": true,
            preflightContinue: true,
          },
          body: JSON.stringify(res.dataValues),
        };
        resolve(response);
      })
      .catch((err) => {
        console.log("GET STATUS ERROR: ", err);
        reject(err);
      });
  });
};

exports.getAllUsers = async (event) => {
  console.log("Event", event);
  const org_id = event.queryStringParameters.organization_id;
  console.log("ORG_ID : ", org_id);
  return new Promise((resolve, reject) => {
    model.User.findAll({
      where: {
        organization_id: org_id,
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

exports.getAdmin = async (event) => {
  let response;
  let org_id = event.queryStringParameters.organization_id;
  let role = event.queryStringParameters.role;
  return new Promise((resolve, reject) => {
    model.User.findOne({
      where: {
        organization_id: org_id,
        role: role,
      },
    })
      .then((res) => {
        console.log("STATUS RESPONSE: ", res);
        if (res) {
          resolve(reply.replyToApi(JSON.stringify(res.dataValues), 200));
        } else {
          resolve(
            reply.replyToApi(JSON.stringify({ message: "No such user" }), 404)
          );
        }
      })
      .catch((err) => {
        console.log("GET STATUS ERROR: ", err);
        reject(err);
      });
  });
};

exports.updateUser = async (event) => {
  return new Promise((resolve, reject) => {
    model.User.update(event, {
      where: {
        id: event.id,
      },
    })
      .then((res) => {
        console.log("User update Success: ", res[0]);
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
            body: "User updated successfully",
          })
        );
      })
      .catch((err) => {
        console.log("User Update Error: ", err);
        reject(err);
      });
  });
};

exports.getUserByStatus = async (event) => {
  let organization_id = event.queryStringParameters.organization_id;
  let status = event.queryStringParameters.status;

  console.log("DATA IN STORE FUNC:", organization_id);
  return new Promise((resolve, reject) => {
    model.User.findAll({
      where: {
        organization_id: organization_id,
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
