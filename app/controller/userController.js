const { Op } = require("sequelize");
const { User } = require("../models");
const validator = require("validator").default;
const bcrypt = require("bcryptjs");
const cloudinary = require("../../middleware/cloudinary");

const handleGetUser = async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.user.email,
      },
    });
    res.send(user);
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

const handleUpdate = async (req, res) => {
  try {
    let hashedPassword;
    const { email, password, nama, kota, alamat, noHp } = req.body;
    const isEmailValid = validator.isEmail(email);
    if (!isEmailValid) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    const sameEmail = await User.findOne({
      where: {
        email,
        id: {
          [Op.ne]: req.user.id,
        },
      },
    });
    if (sameEmail) {
      return res.status(401).json({
        message: "Email already exists",
      });
    }

    const user = await User.findByPk(req.user.id);

    const samePassword = await bcrypt.compare(password, user.password);
    if (!samePassword) {
      hashedPassword = await bcrypt.hash(password, 10);
    } else {
      hashedPassword = user.password;
    }

    const isMobilePhoneValid = validator.isMobilePhone(noHp, "id-ID");
    if (!isMobilePhoneValid) {
      return res.status(400).json({
        message: "Invalid phone number",
      });
    }

    if (req.file) {
      const data = await uploadImage(req, res);
      await user.update(
        {
          nama,
          email,
          password: hashedPassword,
          kota,
          alamat,
          noHp,
          image: data.url,
        },
        {
          where: {
            id: req.user.id,
          },
        }
      );
    } else {
      await user.update(
        {
          nama,
          email,
          password: hashedPassword,
          kota,
          alamat,
          noHp,
          image: req.user.image,
        },
        {
          where: {
            id: req.user.id,
          },
        }
      );
    }

    return res.status(200).json({
      message: "Successfully updated",
    });
  } catch (error) {
    return res.status(401).json({
      message: error.message,
    });
  }
};

const uploadImage = (req, res) => {
  const fileBase64 = req.file.buffer.toString("base64");
  const file = `data:${req.file.mimetype};base64,${fileBase64}`;

  const data = cloudinary.uploader.upload(file, (err, result) => {
    if (err) {
      return false;
    }
    return result.url;
  });
  return data;
};

module.exports = { handleGetUser, handleUpdate };
