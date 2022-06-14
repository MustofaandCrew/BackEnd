const express = require("express");
const upload = require("../middleware/multer");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator").default;
const { User } = require("./models");
const { AuthenticationController, UserController } = require("./controller");

const authenticationController = new AuthenticationController({ userModel: User, bcrypt, jwt, validator });
const userController = new UserController({ userModel: User, validator, bcrypt });
const accessControl = authenticationController.accessControl;

router.get("/", (req, res) => {
  res.send({
    message: "Server is running",
  });
});

router.post("/register", authenticationController.handleRegister);
router.post("/loginBuyer", authenticationController.handleLogin(accessControl.BUYER));
router.post("/loginSeller", authenticationController.handleLogin(accessControl.SELLER));
router.get("/whoAmISeller", authenticationController.authorize(accessControl.SELLER), userController.handleGetUser);
router.get("/whoAmIBuyer", authenticationController.authorize(accessControl.BUYER), userController.handleGetUser);
router.put("/profile", authenticationController.authorize(accessControl.BUYER), upload.single("picture"), userController.handleUpdate);

module.exports = router;
