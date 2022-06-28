const express = require("express");
const app = express();
const cors = require("cors");
const router = require("./router");
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(router);

module.exports = app;
