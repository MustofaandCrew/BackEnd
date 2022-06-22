const { Op } = require("sequelize");
const { User, History, Product, ProductImage } = require("../models");
const bcrypt = require("bcryptjs");
const cloudinary = require("../../middleware/cloudinary");
const { EmailAlreadyRegistered, EmailNotFound, IdNotFound } = require("../error");

const handleGetUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.send({
      message: "Successfully get user",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const handleUpdate = async (req, res) => {
  try {
    let hashedPassword;
    const { id } = req.user;
    const data = {
      email: req.body.email,
      password: req.body.password,
      nama: req.body.nama,
      kota: req.body.kota,
      alamat: req.body.alamat,
      noHp: req.body.noHp,
    };

    const sameEmail = await User.findOne({
      where: {
        email: data.email,
        id: {
          [Op.ne]: id,
        },
      },
    });
    if (sameEmail) {
      const err = new EmailAlreadyRegistered(data.email);
      return res.status(400).json({
        errors: [err.details()],
      });
    }

    const user = await User.findByPk(id);
    if (!user) {
      const err = new IdNotFound(id);
      return res.status(404).json({
        errors: [err.details()],
      });
    }

    const samePassword = await bcrypt.compare(data.password, user.password);
    if (!samePassword) {
      hashedPassword = await bcrypt.hash(data.password, 10);
      data.password = hashedPassword;
    } else {
      hashedPassword = user.password;
      data.password = hashedPassword;
    }

    if (req.file) {
      const image = await uploadImage(req, res);
      handleUpdateWithImage(user, data, image, id);
    } else {
      handleUpdateWithoutImage(user, data, id);
    }

    return res.status(200).json({
      message: "Successfully updated",
    });
  } catch (error) {
    return res.status(400).json({
      error: error.message,
    });
  }
};

const handleBid = async (req, res) => {
  try {
    const { id } = req.user;
    const { productId, harga } = req.body;
    const user = await User.findByPk(id);
    if (!user) {
      const err = new EmailNotFound(email);
      return res.status(400).json({
        errors: [err.details()],
      });
    }

    const product = await Product.findByPk(productId);
    if (!product) {
      const err = new IdNotFound(productId);
      return res.status(404).json({
        errors: [err.details()],
      });
    }

    if (product.userId === id) {
      return res.status(400).json({
        errors: [
          {
            code: "E-015",
            message: "You can't bid your own product",
          },
        ],
      });
    }

    await History.create({
      userId: id,
      productId,
      harga,
      status: "Menunggu Konfirmasi",
      tanggal: new Date(),
    });

    return res.status(200).json({
      message: "Successfully bid",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const handleNotifikasiBuyer = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findByPk(id);
    if (!user) {
      const err = new EmailNotFound(email);
      return res.status(400).json(err.details());
    }

    const notifikasi = await History.findAll({
      where: {
        userId: id,
        status: {
          [Op.or]: ["Diterima", "Ditolak"],
        },
      },
      include: [
        {
          model: Product,
          include: [
            {
              model: ProductImage,
            },
          ],
        },
      ],
    });

    if (notifikasi.length === 0) {
      return res.status(204).end();
    }

    return res.status(200).json({
      message: "Successfully get notifikasi",
      data: notifikasi,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const handleNotifikasiSeller = async (req, res) => {
  try {
    const { id } = req.user;
    const products = await Product.findAll({
      where: {
        userId: id,
        deletedAt: null,
      },
      include: [
        {
          model: ProductImage,
        },
      ],
    });

    if (products.length === 0) {
      return res.status(204).end();
    }

    const productHistories = products.map(async (product) => {
      return await History.findAll({
        where: {
          productId: product.id,
          status: "Menunggu Konfirmasi",
        },
        include: [
          {
            model: User,
          },
          {
            model: Product,
          },
        ],
      });
    });

    const resolvedPromise = await Promise.all(productHistories);

    const data = resolvedPromise.filter((item) => {
      return item.length > 0;
    });

    const notifikasi = destructuring(data);

    if (notifikasi.length === 0) {
      return res.status(204).end();
    }

    return res.status(200).json({
      message: "Successfully get notifikasi",
      data: notifikasi,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const handleUpdateNotifikasi = async (req, res) => {
  try {
    const id = req.params.id;
    const { status } = req.body;

    const history = await History.findByPk(id);

    if (!history) {
      const err = new IdNotFound(id);
      return res.status(404).json({
        errors: [err.details()],
      });
    }

    if (status === "Diterima") {
      await history.update({
        status,
      });

      const rejectedHistory = await History.findAll({
        where: {
          productId: history.productId,
          id: {
            [Op.ne]: id,
          },
        },
      });

      if (rejectedHistory.length > 0) {
        rejectedHistory.forEach(async (history) => {
          await history.update({
            status: "Ditolak",
          });
        });
      }
    } else {
      await history.update({
        status,
      });
    }

    return res.status(200).json({
      message: "Successfully updated",
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const handleGetHistorySeller = async (req, res) => {
  try {
    const { id } = req.user;

    const products = await Product.findAll({
      where: {
        userId: id,
        deletedAt: null,
      },
      include: [
        {
          model: ProductImage,
        },
      ],
    });

    if (products.length === 0) {
      return res.status(204).end();
    }

    const productHistories = products.map(async (product) => {
      return await History.findAll({
        where: {
          productId: product.id,
        },
        include: [
          {
            model: User,
          },
          {
            model: Product,
            include: [
              {
                model: ProductImage,
              },
            ],
          },
        ],
      });
    });

    const resolvedPromise = await Promise.all(productHistories);

    const data = resolvedPromise.filter((item) => {
      return item.length > 0;
    });

    const histories = destructuring(data);

    if (histories.length === 0) {
      return res.status(204).end();
    }

    return res.status(200).json({
      message: "Successfully get histories",
      data: histories,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

const handleGetHistoryBuyer = async (req, res) => {
  try {
    const { id } = req.user;
    const histories = await History.findAll({
      where: {
        userId: id,
      },
      include: [
        {
          model: Product,
          include: [
            {
              model: ProductImage,
            },
          ],
        },
      ],
    });

    if (histories.length === 0) {
      return res.status(204).end();
    }

    return res.status(200).json({
      message: "Successfully get histories",
      data: histories,
    });
  } catch (error) {
    return res.status(400).json({
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

const handleUpdateWithImage = async (user, data, image, userId) => {
  return await user.update(
    {
      nama: data.nama,
      email: data.email,
      password: data.password,
      kota: data.kota,
      alamat: data.alamat,
      noHp: data.noHp,
      image: image.url,
    },
    {
      where: {
        id: userId,
      },
    }
  );
};

const handleUpdateWithoutImage = async (user, data, userId) => {
  return await user.update(
    {
      nama: data.nama,
      email: data.email,
      password: data.password,
      kota: data.kota,
      alamat: data.alamat,
      noHp: data.noHp,
      image: user.image,
    },
    {
      where: {
        id: userId,
      },
    }
  );
};

const destructuring = (data) => {
  let result = [];
  data.forEach((item) => {
    result = [...result, ...item];
  });
  return result;
};

module.exports = {
  handleGetUser,
  handleUpdate,
  handleBid,
  handleNotifikasiBuyer,
  handleNotifikasiSeller,
  handleUpdateNotifikasi,
  handleGetHistorySeller,
  handleGetHistoryBuyer,
};
