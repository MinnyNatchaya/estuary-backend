module.exports = (sequelize, DataTypes) => {
  const ProductTag = sequelize.define(
    'ProductTag',
    {},
    {
      underscored: true
    }
  );

  ProductTag.associate = models => {
    ProductTag.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    ProductTag.belongsTo(models.Tag, {
      foreignKey: {
        name: 'tagId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return ProductTag;
};
