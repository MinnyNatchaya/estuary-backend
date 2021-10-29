module.exports = (sequelize, DataTypes) => {
  const Purchased = sequelize.define(
    'Purchased',
    {},
    {
      underscored: true
    }
  );

  Purchased.associate = models => {
    Purchased.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    Purchased.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return Purchased;
};
