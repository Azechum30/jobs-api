require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
const connectDB = require("./config/connect");
const port = process.env.PORT || 5000;

// additional security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimiter = require("express-rate-limit");

//middleware functions from express
app.set("trust proxy", 1);
app.use(
	rateLimiter({
		max: 200,
		windowMs: 60 * 60 * 1000,
		message: "Too many request from this IP",
	})
);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

//routers
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");

//custom middleware functions
const NotFound = require("./middleware/not-found");
const customErrorHandler = require("./middleware/error-handler");
const authMiddleware = require("./middleware/auth");

//routes
app.use("/api/v1/users/auth", authRouter);
app.use("/api/v1/users/jobs", authMiddleware, jobsRouter);
app.use(NotFound);
app.use(customErrorHandler);

//serve the application

const startApp = async () => {
	try {
		// connect to database server
		await connectDB(process.env.MONGO_URI);
		app.listen(port, () => {
			console.log("App is listening on port", port);
		});
	} catch (error) {
		console.log(error);
	}
};

startApp();
