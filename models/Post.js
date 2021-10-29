module.exports = (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      content: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      hashtag: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      underscored: true,
    },
  );

  Post.associate = (models) => {
    Post.hasMany(models.PostPicture, {
      foreignKey: {
        name: 'postId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Post.hasMany(models.Share, {
      foreignKey: {
        name: 'postId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Post.hasMany(models.Like, {
      foreignKey: {
        name: 'postId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Post.belongsTo(models.User, {
      foreignKey: {
        name: 'userId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Post.belongsTo(models.Community, {
      foreignKey: {
        name: 'communityId',
        allowNull: true,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Post.hasMany(models.Comment, {
      foreignKey: {
        name: 'postId',
        allowNull: true,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });

    Post.hasMany(models.Notification, {
      foreignKey: {
        name: 'postId',
        allowNull: false,
      },
      onDelete: 'RESTRICT',
      onUpdate: 'RESTRICT',
    });
  };

  return Post;
};
