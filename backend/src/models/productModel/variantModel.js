module.exports = (sequelize, DataTypes) => {
  const Variant = sequelize.define("Variant", {
    variantId: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    variantImages: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  });

  return Variant;
};
