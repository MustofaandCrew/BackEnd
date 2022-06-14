const { Op } = require("sequelize");

class UserController {
  constructor({ userModel, validator, bcrypt }) {
    this.userModel = userModel;
    this.validator = validator;
    this.bcrypt = bcrypt;
  }

  handleDetailProfile = async (req, res) => {
    try {
      const user = await this.userModel.findOne({
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

  handleUpdate = async (req, res) => {
    try {
      let hashedPassword;
      const { email, password, nama, kota, alamat, noHp } = req.body;
      const isEmailValid = this.validator.isEmail(email);
      if (!isEmailValid) {
        return res.status(400).json({
          message: "Invalid email",
        });
      }

      const sameEmail = await this.userModel.findOne({
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

      const user = await this.userModel.findByPk(req.user.id);

      const samePassword = await this.bcrypt.compare(password, user.password);
      if (!samePassword) {
        hashedPassword = await this.bcrypt.hash(password, 10);
      } else {
        hashedPassword = user.password;
      }

      const isMobilePhoneValid = this.validator.isMobilePhone(noHp, "id-ID");
      if (!isMobilePhoneValid) {
        return res.status(400).json({
          message: "Invalid phone number",
        });
      }

      if (!req.file) {
        await user.update(
          {
            email,
            password: hashedPassword,
            nama,
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
      } else {
        await user.update(
          {
            email,
            password: hashedPassword,
            nama,
            kota,
            alamat,
            noHp,
            image: req.file.filename,
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
}

module.exports = UserController;
