const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator").default;
const { User } = require("../models");
const { EmailAlreadyRegistered, InvalidEmail, WrongPassword, NullBody, EmailNotFound } = require("../error");

const authorize = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      return res.status(401).json({
        message: "No token provided",
      });
    }
    const token = auth.split(" ")[1];
    const decoded = decodeToken(token);
    if (!decoded) {
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

const handleLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const isEmailValid = validator.isEmail(email);
    if (!isEmailValid) {
      const err = new InvalidEmail(email);
      return res.status(400).json(err.details());
    }

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
    const err = new NullBody();
    return res.status(400).json(err.details());
  }
};

const handleRegister = async (req, res) => {
  try {
    const { nama, email, password } = req.body;
    const isEmailValid = validator.isEmail(email);
    if (!isEmailValid) {
      const err = new InvalidEmail(email);
      return res.status(400).json(err.details());
    }

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
    const err = new NullBody();
    return res.status(400).json(err.details());
  }
};

const createToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      nama: user.nama,
      kota: user.kota,
      alamat: user.alamat,
      noHp: user.noHp,
      image: user.image,
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
