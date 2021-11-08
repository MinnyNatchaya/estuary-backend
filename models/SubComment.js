module.exports = (sequelize, DataTypes) => {
  const SubComment = sequelize.define(
    'SubComment',
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

  SubComment.associate = models => {
    SubComment.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });

    SubComment.belongsTo(models.Comment, {
      foreignKey: {
        name: 'commentId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });

    SubComment.hasMany(models.Notification, {
      foreignKey: {
        name: 'subCommentId',
        allowNull: true
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return SubComment;
};
