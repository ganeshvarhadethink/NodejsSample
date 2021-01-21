"use strict";
require("dotenv").config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  process.env.dbName,
  process.env.username,
  process.env.password,
  {
    host: process.env.host,
    dialect: process.env.dialect,
  }
);
var models = ["User", "Organization", "Address", "Device", "DevicePolicy"];
var db = {};
sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

db.DeviceLocation = sequelize.import(
  "../api/Device/Entities/DeviceLocation.js"
);
db.Endpoint = sequelize.import("../api/DevicePolicy/Entities/Endpoint.js");
db.IperfData = sequelize.import("../api/Device/Entities/IperfData.js");
db.TraceRoute = sequelize.import("../api/Device/Entities/TraceRoute.js");
db.PolicyEndpointBridge = sequelize.import(
  "../api/DevicePolicy/Entities/PolicyEndpointBridge.js"
);
db.DevicePolicyBridge = sequelize.import(
  "../api/Device/Entities/DevicePolicyBridge.js"
);

models.forEach((model) => {
  db[model] = sequelize.import(
    "../api/" + model + "/Entities/" + model + ".js"
  );
});
Object.keys(db).forEach(function (modelName) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// (async () => {
//   await sequelize
//     .sync()
//     .then((res) => {
//       console.log("SYNC SUCCESS: ");
//     })
//     .catch((err) => {
//       console.log("SYNC ERROR ", err);
//     });
// })();

module.exports = db;
