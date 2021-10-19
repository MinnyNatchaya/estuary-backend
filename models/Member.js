module.exports = (sequelize, DataTypes) => {
  const Member = sequelize.define(
    'Member',
    {
      role: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {
      underscored: true
    }
  );

  Member.associate = models => {
    Member.belongsTo(models.Community, {
      foreignKey: {
        name: 'communityId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });

    Member.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return Member;
};
