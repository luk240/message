import { WebSocket, WebSocketServer } from "ws";
import { makeApp } from "./app/app";
import { dbConn } from "./db";
import {config} from "dotenv";

config(); // Load .env to procces.env
dbConn();
if (process.env.TOK_SECRET) process.env.TOK_SECRET = "localhost";

const port = process.env.PORT || 5000;
const app = makeApp();
const server = app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});
const wss = new WebSocketServer({noServer: true}) // set end utf8?

/*
wss.on("open", (socket) => {
	socket.send("User has connected to ws")
});
wss.on("message", (data) => {
	console.log("Inc WS-msg: %s:", data)
});
*/

wss.on("connection", (socket) => {
	socket.on("message", (data) => {
		// Log to node
		console.log("Client:", data.toString())
		// Send to all clients except sender
		wss.clients.forEach((c) => {
			//if (c != socket && c.readyState == WebSocket.OPEN) {
				c.send(data.toString())
			//}
		})
	});
	socket.on("error", (err) => console.log(err));
});

// Add&Start server
server.on('upgrade', (request, socket, head) => {
	//socket.setEncoding("utf-8")
	wss.handleUpgrade(request, socket, head, (socket) => {
		wss.emit('connection', socket, request);
	});
});
