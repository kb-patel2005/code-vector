const { DataTypes } = require("sequelize");
const sequelize = require("../db.js");

const Product = sequelize.define("Product", {
  name: DataTypes.STRING,
  category: DataTypes.STRING,
  price: DataTypes.FLOAT,
  created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  tableName: "products",
  timestamps: false
});

module.exports = Product;
