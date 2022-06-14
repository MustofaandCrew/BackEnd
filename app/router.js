const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("./models");
const { AuthenticationController } = require("./controller");

const userModel = User;
const authenticationController = new AuthenticationController({ userModel, bcrypt, jwt });
const accessControl = authenticationController.accessControl;

router.get("/", (req, res) => {
  res.send({
    message: "Server is running",
  });
});

router.post("/register", authenticationController.handleRegister);
router.post("/loginBuyer", authenticationController.handleLogin(accessControl.BUYER));
router.post("/loginSeller", authenticationController.handleLogin(accessControl.SELLER));
router.get("/whoAmISeller", authenticationController.authorize(accessControl.SELLER), authenticationController.handleGetUser);
router.get("/whoAmIBuyer", authenticationController.authorize(accessControl.BUYER), authenticationController.handleGetUser);

module.exports = router;
