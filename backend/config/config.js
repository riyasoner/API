require("dotenv").config();
const { DB_HOST, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(DB_NAME, DB_USERNAME, DB_PASSWORD, {
  host: DB_HOST,
  dialect: "mysql",
  logging: false,
  pool: {
    max: 20,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});
const db = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Product = require("../src/models/productModel/productModel")(
  sequelize,
  DataTypes
);
db.Variant = require("../src/models/productModel/variantModel")(
  sequelize,
  DataTypes
);
db.User = require("../src/models/userModel/userModel")(sequelize, DataTypes);
require("../config/association")(db);

(async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection has been established successfully with the database."
    );
    await sequelize.sync({ alter: true });
    console.log("Models synchronized.");
  } catch (error) {
    console.error(" Unable to connect to the database:", error);
  }
})();

module.exports = db;
