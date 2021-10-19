module.exports = (sequelize, DataTypes) => {
  const ChatRoom = sequelize.define(
    'ChatRoom',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true
    }
  );

  ChatRoom.associate = models => {
    ChatRoom.hasMany(models.Chatlog, {
      foreignKey: {
        name: 'chatRoomId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
    ChatRoom.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return ChatRoom;
};
