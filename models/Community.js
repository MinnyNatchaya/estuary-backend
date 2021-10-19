module.exports = (sequelize, DataTypes) => {
  const Community = sequelize.define(
    'Community',
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

  Community.associate = models => {
    Community.hasMany(models.Member, {
      foreignKey: {
        name: 'communityId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return Community;
};
