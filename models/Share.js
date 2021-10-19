module.exports = (sequelize, DataTypes) => {
  const Share = sequelize.define(
    'Share',
    {},
    {
      underscored: true
    }
  );

  Share.associate = models => {
    Share.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });

    Share.belongsTo(models.Post, {
      foreignKey: {
        name: 'postId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });

    Share.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return Share;
};
