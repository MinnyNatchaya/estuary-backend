module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define(
    'Comment',
    {
      content: {
        type: DataTypes.STRING,
        allowNull: true
      },
      pic: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      underscored: true
    }
  );

  Comment.associate = models => {
    Comment.belongsTo(models.Product, {
      foreignKey: {
        name: 'productId',
        allowNull: false
      }
    });

    Comment.belongsTo(models.Post, {
      foreignKey: {
        name: 'postId',
        allowNull: false
      }
    });

    Comment.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });

    Comment.hasMany(models.SubComment, {
      foreignKey: {
        name: 'commentId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return Comment;
};