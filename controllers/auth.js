const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/users");
const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
	const user = await User.create({ ...req.body });
	const token = user.createJWT();
	res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token: token });
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email) {
		throw new BadRequestError("please provide an email");
	} else if (!password) {
		throw new BadRequestError("please provide a password");
	}
	const user = await User.findOne({ email });
	if (!user) {
		throw new UnauthenticatedError("Invalid email id");
	}

	const isPasswordMatch = await user.comparePassword(password);
	if (!isPasswordMatch) {
		throw new UnauthenticatedError("Invalid password");
	}

	const token = user.createJWT();
	res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
};

module.exports = {
	register,
	login,
};
