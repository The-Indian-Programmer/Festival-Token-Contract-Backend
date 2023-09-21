const express = require("express");
const ethers = require('ethers');
var cors = require("cors");
global.moment = require("moment");
global.node_validator = require("node-input-validator");
global.sequelize = require("./services/databaseConnection");
global.contractEvent = require("./services/contractConnection");
global.cookieParser = require('cookie-parser');
global.sql = require("mysql2");
global.helper = require("./helpers/helper");
global.msgHelper = require("./helpers/msg.js");
const logger = require('morgan');

const bodyParser = require("body-parser");
const path = require("path");
const apiRouting = require("./routes/apiRouting");
const app = express();
require("dotenv").config(); //instatiate environment variables


app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

const CONFIG = require("./configs/config.js");



console.log("Environment:", CONFIG.ENVIRONMENT);


app.use("/api", apiRouting);


// return 404 if no route matched
app.use((req, res) => {
  res.status(404).json({ status: false, message: "Route not found"});
});

module.exports = app;
