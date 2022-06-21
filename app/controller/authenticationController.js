const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { EmailAlreadyRegistered, WrongPassword, EmailNotFound, NoTokenProvided, InvalidToken } = require("../error");

const authorize = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      const err = new NoTokenProvided();
      return res.status(401).json(err.details());
    }

    const token = auth.split(" ")[1];
    const decoded = decodeToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    const err = new InvalidToken();
    return res.status(401).json(err.details());
  }
};

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      const err = new EmailNotFound(email);
      return res.status(400).json(err.details());
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      const err = new WrongPassword();
      return res.status(400).json(err.details());
    }

    const token = createToken(user);
    return res.status(200).json({
      token,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const handleRegister = async (req, res) => {
  try {
    const { nama, email, password } = req.body;

    const user = await User.findOne({
      where: { email },
    });

    if (user) {
      const err = new EmailAlreadyRegistered();
      return res.status(400).json(err.details());
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      nama,
      email,
      password: hashedPassword,
    });

    return res.status(200).json({
      message: "Successfully registered",
      newUser,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
    },
    process.env.JWT_SECRET
  );
};

const verifyPassword = async (password, encryptedPassword) => {
  return await bcrypt.compare(password, encryptedPassword);
};

const decodeToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = { authorize, handleLogin, handleRegister };
