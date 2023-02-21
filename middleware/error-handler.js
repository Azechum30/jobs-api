const { StatusCodes } = require("http-status-codes");

const customErrorHandler = (err, req, res, next) => {
	let customError = {
		statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
		msg: err.message || "Something went wrong, please try again later.",
	};

	if (err.name === "CastError") {
		customError.msg = `${err.value} is not a valid job id`;
		customError.statusCode = StatusCodes.NOT_FOUND;
	}

	if (err.name === "ValidationError") {
		customError.msg = Object.values(err.errors)
			.map((error) => {
				return error.message;
			})
			.join(",");
		customError.statusCode = StatusCodes.BAD_REQUEST;
	}

	if (err.code && err.code === 11000) {
		customError.msg = `${Object.keys(err.keyValue)} id already exist.`;
		customError.statusCode = StatusCodes.BAD_REQUEST;
	}

	res.status(customError.statusCode).json({ msg: customError.msg });
};

module.exports = customErrorHandler;
