module.exports = (db) => {
  db.Product.hasMany(db.Variant, {
    foreignKey: "productId",
    as: "variants",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
  db.Variant.belongsTo(db.Product, {
    foreignKey: "productId",
    as: "product",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  });
};
