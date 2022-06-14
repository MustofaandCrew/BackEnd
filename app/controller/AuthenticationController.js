class AuthenticationController {
  constructor({ userModel, bcrypt, jwt, validator }) {
    this.userModel = userModel;
    this.bcrypt = bcrypt;
    this.jwt = jwt;
    this.validator = validator;
  }

  authorize = async (req, res, next) => {
    try {
      const auth = req.headers.authorization;
      if (!auth) {
        return res.status(401).json({
          message: "No token provided",
        });
      }
      const token = auth.split(" ")[1];
      const decoded = this.decodeToken(token);
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

  handleLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await this.userModel.findOne({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({
          message: "Invalid email",
        });
      }

      const isPasswordValid = await this.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          message: "Invalid password",
        });
      }

      const token = this.createToken(user);
      return res.status(200).json({
        token,
      });
    } catch (error) {
      return res.status(401).json({
        message: error.message,
      });
    }
  };

  handleRegister = async (req, res) => {
    try {
      const { nama, email, password } = req.body;
      const isEmailValid = this.validator.isEmail(email);
      if (!isEmailValid) {
        return res.status(400).json({
          message: "Invalid email",
        });
      }

      const user = await this.userModel.findOne({
        where: { email },
      });

      if (user) {
        return res.status(401).json({
          message: "Email already exists",
        });
      }

      const hashedPassword = await this.bcrypt.hash(password, 10);
      const newUser = await this.userModel.create({
        nama,
        email,
        password: hashedPassword,
      });

      return res.status(200).json({
        message: "Successfully registered",
        newUser,
      });
    } catch (error) {
      return res.status(401).json({
        message: error.message,
      });
    }
  };

  createToken = (user) => {
    return this.jwt.sign(
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

  verifyPassword = async (password, encryptedPassword) => {
    return await this.bcrypt.compare(password, encryptedPassword);
  };

  decodeToken = (token) => {
    return this.jwt.verify(token, process.env.JWT_SECRET);
  };
}

module.exports = AuthenticationController;
