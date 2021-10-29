module.exports = (sequelize, DataTypes) => {
	const Chatlog = sequelize.define(
		"Chatlog",
		{
			content: {
				type: DataTypes.STRING,
				allowNull: false,
			},
		},
		{
			underscored: true,
		}
	);

	Chatlog.associate = (models) => {
		Chatlog.belongsTo(models.Community, {
			foreignKey: {
				name: "communityId",
				// allowNull: false,
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT",
		});
		Chatlog.belongsTo(models.User, {
			as: "sender",
			foreignKey: {
				name: "senderId",
				allowNull: false,
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT",
		});
		Chatlog.belongsTo(models.User, {
			as: "receiver",
			foreignKey: {
				name: "receiverId",
				// allowNull: false,
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT",
		});
	};
	return Chatlog;
};
