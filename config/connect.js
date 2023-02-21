const mongoose = require("mongoose");

// invoke a promise method that will connect to the mongodb database server
// it usually advised to embrace the promise in an async function

module.exports = (url) => {
	mongoose.set("strictQuery", true);
	return mongoose
		.connect(url)
		.then(() => {
			console.log("connected to mongodb");
		})
		.catch((err) => {
			console.log(err);
		});
};
