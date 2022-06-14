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

router.get("/", (req, res) => {
  res.send({
    message: "Server is running",
  });
});

router.post("/register", authenticationController.handleRegister);
router.post("/login", authenticationController.handleLogin);
router.get("/profile", authenticationController.authorize, userController.handleDetailProfile);
router.put("/profile", authenticationController.authorize, upload.single("picture"), userController.handleUpdate);

module.exports = router;
