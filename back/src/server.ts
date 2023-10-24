import "./db";
import { makeApp } from "./app/app";
import wsInit from "./app/ws";
import dotenv from "dotenv";

dotenv.config(); // Load .env to procces.env

const port = process.env.PORT || 5000;
const app = makeApp();
const server = app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
wsInit(server);
