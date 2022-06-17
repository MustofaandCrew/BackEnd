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
      Product.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      Product.belongsToMany(models.Category, {
        through: "ProductCategory",
        foreignKey: "productId",
        onDelete: "CASCADE",
      });
      Product.hasMany(models.ProductImage, {
        foreignKey: "productId",
        onDelete: "CASCADE",
      });
      Product.hasOne(models.History, {
        foreignKey: "productId",
        onDelete: "CASCADE",
      });
    }
  }
  Product.init(
    {
      nama: DataTypes.STRING,
      harga: DataTypes.FLOAT,
      deskripsi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Product",
    }
  );
  return Product;
};
