module.exports = (sequelize, DataTypes) => {
	const Notification = sequelize.define(
		"Notification",
		{
			content: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			isViewed: {
				type: DataTypes.BOOLEAN,
				allowNull: false,
				defaultValue: false,
			},
			actionType: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			actionOn: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			underscored: true,
		}
	);

	Notification.associate = (models) => {
		Notification.belongsTo(models.Following, {
			foreignKey: {
				name: "followingId",
				allowNull: true,
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT",
		});

		Notification.belongsTo(models.Community, {
			foreignKey: {
				name: "communityId",
				allowNull: true,
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT",
		});

		Notification.belongsTo(models.Post, {
			foreignKey: {
				name: "postId",
				allowNull: true,
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT",
		});

		Notification.belongsTo(models.Comment, {
			foreignKey: {
				name: "commentId",
				allowNull: true,
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT",
		});

		Notification.belongsTo(models.SubComment, {
			foreignKey: {
				name: "subCommentId",
				allowNull: true,
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT",
		});

		Notification.belongsTo(models.User, {
			foreignKey: {
				name: "userId",
				allowNull: false,
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT",
		});
		Notification.belongsTo(models.Like, {
			foreignKey: {
				name: "likeId",
				allowNull: true,
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT",
		});
		Notification.belongsTo(models.Member, {
			foreignKey: {
				name: "newMemberId",
				allowNull: true,
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT",
		});
	};

	return Notification;
};
