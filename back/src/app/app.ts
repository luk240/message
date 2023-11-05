import express from "express";
import userRouter from "./user/user_router";
import convoRouter from "./convo/convo_router";
import msgRouter from "./message/msg_router";

export function makeApp() {
	const app = express();

	app.use(express.json());
	app.use((_, res, next) => {
		res.header("Access-Control-Allow-Origin", process.env.DOMAIN || "*");
		res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
		// Must include credentials front-end fetch | Cookies breaks if origin = "*"
		res.header("Access-Control-Allow-Credentials", "true");
		next();
	});

	app.use("/user", userRouter)
	.use("/convo", convoRouter)
	.use("/msg", msgRouter);

	app.get("/", (_, res) => {
		res.send("Backend endpoint.");
	});

	return app;
}
