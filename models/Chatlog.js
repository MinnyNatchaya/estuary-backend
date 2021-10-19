module.exports = (sequelize, DataTypes) => {
  const Chatlog = sequelize.define(
    'Chatlog',
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true
    }
  );

  Chatlog.associate = models => {
    Chatlog.belongsTo(models.ChatRoom, {
      foreignKey: {
        name: 'chatRoomId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    Chatlog.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };
  return Chatlog;
};
