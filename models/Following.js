module.exports = (sequelize, DataTypes) => {
  const Following = sequelize.define(
    'Following',
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

  Following.associate = models => {
    Following.belongsTo(models.User, {
      as: 'follower',
      foreignKey: {
        name: 'followerId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    Following.belongsTo(models.User, {
      as: 'followed',
      foreignKey: {
        name: 'followedId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });

    Following.hasMany(models.Notification, {
      foreignKey: {
        name: 'followingId',
        allowNull: true
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return Following;
};
