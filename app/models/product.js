"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Product.belongsTo(models.User, {
      //   foreignKey: "userId",
      //   allowNull: false,
      // });
      Product.belongsToMany(models.Category, {
        through: "ProductCategory",
        foreignKey: "productId",
      });
      Product.hasMany(models.ProductImage, {
        foreignKey: "productId",
      });
      Product.hasOne(models.History, {
        foreignKey: "productId",
      });
    }
  }
  Product.init(
    {
      nama: DataTypes.STRING,
      harga: DataTypes.FLOAT,
      deskripsi: DataTypes.STRING,
      // userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
