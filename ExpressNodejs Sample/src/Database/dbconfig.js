"use strict";
require("dotenv").config();
console.log(require("dotenv").config());
const Sequelize = require("sequelize");
console.log("env ", process.env.username);
const sequelize = new Sequelize(
  process.env.dbName,
  "postgres",
  process.env.password,
  {
    host: process.env.host,
    dialect: process.env.dialect,
    port: 5432,
  }
);
var models = [
  "User",
  "Organization",
  "Log",
  "Request",
  "Site",
  "Host",
  "Appliance",
  "Dongle",
  "Terminal",
];
var db = {};
sequelize
  .authenticate()
  .then(() => {
    console.log("Database Connection has been established successfully.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });
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

module.exports = db;
