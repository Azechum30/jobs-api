const { UnauthenticatedError, BadRequestError } = require("../errors");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
	const authHeaders = req.headers.authorization;
	if (!authHeaders || !authHeaders.startsWith("Bearer ")) {
		throw new UnauthenticatedError("Authentication failed");
	}

	const token = authHeaders.split(" ")[1];
	try {
		const payload = jwt.verify(token, process.env.JWT_SECRET);
		const { userId, username } = payload;
		req.user = { userId, username };
		next();
	} catch (error) {
		throw new UnauthenticatedError("Authentication failed");
	}
};

module.exports = authMiddleware;
