import { Server } from "http";
import { WebSocket, WebSocketServer } from "ws";
import { WsGet, WsSend } from "./types/index";

const wss = new WebSocketServer({noServer: true});
const heartbeat = 30000;

function sockerPreErr(e:Error) {
	console.log(e);
}
function sockerPostErr(e:Error) {
	console.log(e);
}
function ping(ws:WebSocket) {
	ws.send(JSON.stringify({type: "ping"}), {binary: false})
}

export default function wsInit(server:Server) {
	// Add server to wss
	server.on("upgrade", (req, socket, head) => {
		socket.on("error", sockerPreErr);
		//socket.setEncoding("utf-8")
		wss.handleUpgrade(req, socket, head, (ws) => {
			socket.removeListener("error", sockerPreErr);
			wss.emit("connection", ws, req);
		});
	});
}

wss.on("connection", (ws:WebSocket, req) => {
	console.log("WS-client connected");
	ws.isAlive = true;
	ws.on("error", sockerPostErr);

	ws.on("message", (rData, isBinary) => {
		try {
			console.log("WS-client:", rData.toString());
			var data:WsGet = JSON.parse(rData.toString());
			if (!data.hasOwnProperty("type")) throw rData;
		}catch(err) {
			console.log("WS-onmessage invalid:", err);
			return;
		}

		if (data.type == "pong") { // If we receive pong conn is alive
			ws.isAlive = true;
			return; // Dont send "pong" to client, can be seen in browser "ws res log"
		}
		// Send to all clients
		wss.clients.forEach((c) => {
			if (c.readyState === WebSocket.OPEN) { // Exclude self: c !== ws
				c.send(rData, {binary: isBinary});
			}
		});
	});

	ws.on("close", () => {
		console.log("WS-conn closed");

		// Show dissconnect
		const sysMsg = {type: "sys", content: "{User} disconnected"};
		wss.clients.forEach((c) => {
			if (c.readyState === WebSocket.OPEN) {
				c.send(JSON.stringify(sysMsg), {binary: false});
			}
		});
	});

});

// Ping/Pong
const interval = setInterval(() => {
	console.log("Ping...");
	wss.clients.forEach(function test(c:WebSocket) {
		if (c.isAlive == false) return c.terminate();
		c.isAlive = false;
		ping(c); // ping client
	});
}, heartbeat);

wss.on("close", () => {
	clearInterval(interval);
});
