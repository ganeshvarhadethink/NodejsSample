const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const db = require("./src/Database/dbconfig");
var authentication = require("./src/Service/service");
const Auth = require("./src/api/Auth/Routes/routes");
const routes = [
  "Auth",
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "DELETE, PUT, GET, POST, PATCH");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/Auth", Auth);
routes.forEach((route) => {
  let routers = require("./src/api/" + route + "/Routes/routes.js");
  app.use("/" + route, authentication.Validate, routers);
});

app.use("*", function (req, res) {
  res.status(404).send("404");
});

db.sequelize.sync({ alter: true });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
