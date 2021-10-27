module.exports = (sequelize, DataTypes) => {
	const Community = sequelize.define(
		"Community",
		{
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			communityPic: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{
			underscored: true,
		}
	);

	Community.associate = (models) => {
		Community.hasMany(models.Member, {
			foreignKey: {
				name: "communityId",
				allowNull: false,
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT",
		});

		Community.hasMany(models.Notification, {
			foreignKey: {
				name: "communityId",
				allowNull: false,
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT",
		});
		Community.hasMany(models.Chatlog, {
			foreignKey: {
				name: "communityId",
				allowNull: false,
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT",
		});
		Community.hasMany(models.Post, {
			foreignKey: {
				name: "communityId",
				allowNull: true,
			},
			onDelete: "RESTRICT",
			onUpdate: "RESTRICT",
		});
	};

	return Community;
};
