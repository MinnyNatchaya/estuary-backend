module.exports = (err, req, res, next) => {
	// console.log("error name is: ", err.name);
	// console.log("err errors: ", err.errors);
	// console.log("error: ", err);
	let errObj = {};

	console.log("error is: ", err);

	if (err.storageErrors) {
		errObj.imageFormat = err.message;
		errObj.code = 400;
	}

	//for email validation
	if (err.name === "SequelizeValidationError" && err.errors[0].validatorName === "isEmail") {
		errObj.emailChar = "invalid email format";
		errObj.code = 400;
	}

	//for unique constraint
	if (err.name === "SequelizeUniqueConstraintError" && err.errors[0].path === "users.username") {
		errObj.usernameSame = "username already in use";
		errObj.code = 400;
	}
	if (err.name === "SequelizeUniqueConstraintError" && err.errors[0].path === "users.email") {
		errObj.emailSame = "email already in use";
		errObj.code = 400;
	}

	if (err.name === "JsonWebTokenError") {
		errObj.code = 401;
	}

	if (err.name === "TokenExpiredError") {
		errObj.code = 401;
	}

	// console.log(errObj);

	res.status(errObj.code || 500).send({
		message: Object.keys(errObj).length !== 0 ? errObj : err.message,
	});
};
