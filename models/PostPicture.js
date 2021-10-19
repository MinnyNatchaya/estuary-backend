module.exports = (sequelize, DataTypes) => {
  const PostPicture = sequelize.define(
    'PostPicture',
    {
      pic: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      underscored: true
    }
  );

  PostPicture.associate = models => {
    PostPicture.belongsTo(models.Post, {
      foreignKey: {
        name: 'postId',
        allowNull: false
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT'
    });
  };

  return PostPicture;
};
