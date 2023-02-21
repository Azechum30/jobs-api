const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const schema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "name is required"],
		minLength: [6, "name should be at least 6 characters long"],
	},

	email: {
		type: String,
		match: [/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/, "provide a valid email address"],
		unique: true,
		required: [true, "email is required"],
	},

	password: {
		type: String,
		minLength: [6, "password should be at least 6 characters long"],
		required: [true, "password is required"],
	},
});

schema.pre("save", async function () {
	const salt = await bcrypt.genSalt(10);
	return (this.password = await bcrypt.hash(this.password, salt));
});

schema.methods.createJWT = function () {
	const token = jwt.sign({ userId: this._id, username: this.name }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRATION });
	return token;
};

schema.methods.comparePassword = async function (password) {
	const isMatch = await bcrypt.compare(password, this.password);
	return isMatch;
};

module.exports = mongoose.model("Users", schema);
