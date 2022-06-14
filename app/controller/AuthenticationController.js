class AuthenticationController {
  constructor({ userModel, bcrypt, jwt, validator }) {
    this.userModel = userModel;
    this.bcrypt = bcrypt;
    this.jwt = jwt;
    this.validator = validator;
  }

  accessControl = {
    BUYER: "BUYER",
    SELLER: "SELLER",
  };

  authorize = (rolename) => {
    return (req, res, next) => {
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
        if (decoded.rolename !== rolename) {
          return res.status(401).json({
            message: "Unauthorized",
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
  };

  handleLogin = (rolename) => {
    return async (req, res) => {
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

        const token = this.createToken(user, rolename);
        return res.status(200).json({
          token,
        });
      } catch (error) {
        return res.status(401).json({
          message: error.message,
        });
      }
    };
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

  createToken = (user, rolename) => {
    return this.jwt.sign(
      {
        id: user.id,
        email: user.email,
        nama: user.nama,
        kota: user.kota,
        alamat: user.alamat,
        noHp: user.noHp,
        image: user.image,
        rolename: rolename,
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

// const register = async (req, res) => {
//   try {
//     const { nama, email, password } = req.body;
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await User.create({
//       nama,
//       email,
//       password: hashedPassword,
//     });
//     res.send({
//       message: "User berhasil ditambahkan",
//       user,
//     });
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//     });
//   }
// };

// const loginBuyer = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({
//       where: {
//         email,
//       },
//     });
//     if (!user) {
//       return res.status(404).send({
//         message: "Email Salah",
//       });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).send({
//         message: "Password salah",
//       });
//     }
//     const token = jwt.sign(
//       {
//         id: user.id,
//         email: user.email,
//         nama: user.nama,
//         kota: user.kota,
//         alamat: user.alamat,
//         noHp: user.noHp,
//         image: user.image,
//         role: "buyer",
//       },
//       process.env.JWT_SECRET
//     );
//     res.send({
//       message: "Login berhasil",
//       token,
//     });
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//     });
//   }
// };

// const loginSeller = async (req, res) => {
//   try {
//     const { email, password } = req.body;
//     const user = await User.findOne({
//       where: {
//         email,
//       },
//     });
//     if (!user) {
//       return res.status(404).send({
//         message: "Email Salah",
//       });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).send({
//         message: "Password salah",
//       });
//     }
//     const token = jwt.sign(
//       {
//         id: user.id,
//         email: user.email,
//         nama: user.nama,
//         kota: user.kota,
//         alamat: user.alamat,
//         noHp: user.noHp,
//         image: user.image,
//         role: "seller",
//       },
//       process.env.JWT_SECRET
//     );
//     res.send({
//       message: "Login berhasil",
//       token,
//     });
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//     });
//   }
// };

// const authorizationSeller = async (req, res, next) => {
//   try {
//     const { authorization } = req.headers;
//     const token = authorization.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.role !== "seller") {
//       return res.status(401).send({
//         message: "You are not authorized to access this resource",
//       });
//     }
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).send({
//       message: "Token tidak valid",
//     });
//   }
// };
// const authorizationBuyer = async (req, res, next) => {
//   try {
//     const { authorization } = req.headers;
//     const token = authorization.split(" ")[1];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.role !== "buyer") {
//       return res.status(401).send({
//         message: "You are not authorized to access this resource",
//       });
//     }
//     req.user = decoded;
//     next();
//   } catch (error) {
//     res.status(401).send({
//       message: "Token tidak valid",
//     });
//   }
// };

// const getUser = async (req, res) => {
//   try {
//     res.send(req.user);
//   } catch (error) {
//     res.status(500).send({
//       message: error.message,
//     });
//   }
// };
