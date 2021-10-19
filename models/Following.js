module.exports = (sequelize, DataTypes) => {
  const Following = sequelize.define(
    'Following',
    {},
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
        allowNull: true
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });

    Following.hasMany(models.Notification, {
      foreignKey: {
        name: 'followingId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return Following;
};
