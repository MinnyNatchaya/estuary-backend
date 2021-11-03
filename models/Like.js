module.exports = (sequelize, DataTypes) => {
  const Like = sequelize.define(
    'Like',
    {
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      underscored: true
    }
  );

  Like.associate = models => {
    Like.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });

    Like.belongsTo(models.Post, {
      foreignKey: {
        name: 'postId',
        allowNull: true
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });

    Like.belongsTo(models.Comment, {
      foreignKey: {
        name: 'commentId',
        allowNull: true
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });

    Like.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: true
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };
  return Like;
};
