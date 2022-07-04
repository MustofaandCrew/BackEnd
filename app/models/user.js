"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Product, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      User.hasMany(models.History, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      nama: DataTypes.STRING,
      kota: DataTypes.STRING,
      alamat: DataTypes.STRING,
      noHp: DataTypes.STRING,
      image: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
