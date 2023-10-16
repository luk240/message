import { Server } from "http";
import { RawData, WebSocket, WebSocketServer } from "ws";
import { WsGet, WsSend } from "../types/index";
import { wsTokAuth } from "../app/middlewares";
import USER from "./user/user_dao";

const wss = new WebSocketServer({noServer: true});
const heartbeat = 30000;
const interval = setInterval(() => { // Ping/Pong
	console.log("Ping...");
	wss.clients.forEach((c:any) => {
		if (c.isAlive == false) return c.terminate();
		c.isAlive = false;
		ping(c); // ping client
	});
}, heartbeat);
const clients = {
	threads: {} as {[k:string]: WebSocket[]}
}

function socketPreErr(e:Error) {
	console.log(e);
}
function socketPostErr(e:Error) {
	console.log(e);
}
function ping(ws:WebSocket) {
	ws.send(JSON.stringify({type: "ping"}), {binary: false})
}

function handleMessage(ws:WebSocket, rData:RawData) {
	try {
		console.log("WS-client:", rData.toString());
		var data:WsGet = JSON.parse(rData.toString());
		if (!data.hasOwnProperty("type")) throw rData;
	}catch(err) {
		console.log("WS-onmessage invalid:", err);
		return false;
	}
	
	switch(data.type) {
		case "pong":
			ws.isAlive = true;
			return false;
		case "msg":
			(data as WsSend).name = ws.usr.name;
			return JSON.stringify(data);
		case "sys":
			return JSON.stringify({type: "sys", content: `${ws.usr.name} connected`});
		default:
			return rData
	}
}

function sendAll(ws:WebSocket) {
	ws.on("message", (rData, isBinary) => {

		if (!handleMessage(ws, rData)) return;

		wss.clients.forEach((c) => { // Exclude self: c !== ws
			if (c.readyState === WebSocket.OPEN) c.send(rData, {binary: isBinary});
		});
	});

	ws.on("close", () => {
		console.log("WS-conn closed");
	});
}

function sendThread(ws:WebSocket, threadId: string) {
	const threads = clients.threads;

	// Create or push to ws to threads
	if (!threads[threadId]) threads[threadId] = [ws];
	else threads[threadId].push(ws);

	ws.on("message", (rData, isBinary) => {
		const data = handleMessage(ws, rData);
		if (!data) return;

		threads[threadId].forEach((c) => {
			if (c.readyState === WebSocket.OPEN) c.send(data, {binary: isBinary});
		});
	});

	ws.on("close", () => {
		console.log("WS-conn closed");
		const idx = threads[threadId].indexOf(ws);
		if (idx !== -1) { // Clean up threads arr and rm it if empty
			threads[threadId].splice(idx, 1);
			if (threads[threadId].length === 0) {delete threads[threadId]; return}
			else {
				// Show dissconnect
				const sysMsg = JSON.stringify({type: "sys", content: `${ws.usr.name} disconnected`});
				threads[threadId].forEach((c) => {
					if (c.readyState === WebSocket.OPEN) c.send(sysMsg, {binary: false});
				});
			}
		}
	});
}


export default function wsInit(server:Server) {
	// Add server to wss | HTTP handshake before upgrade
	server.on("upgrade", (req, socket, head) => {
		socket.on("error", socketPreErr);
		console.log("ws handshake:", req.headers);

		if (!wsTokAuth(req)) {
			socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
			socket.destroy();
			return;
		}

		wss.handleUpgrade(req, socket, head, (ws) => {
			socket.removeListener("error", socketPreErr);
			wss.emit("connection", ws, req);
		});
	});
}

wss.on("connection", async (ws:WebSocket, req) => {
	console.log("WS-client connected", req.url);
	ws.isAlive = true;
	ws.on("error", socketPostErr);

	try {
		const name = await USER.getUserName(req.tok.id);
		ws.usr = {"id": req.tok.id, "name": name};
	}catch(e) {
		console.log(e);
		return
	}

	if (!req.url || req.url == "/") sendThread(ws, "OPEN");
	else {
		const idx = req.url.indexOf("?"); // "/123/456?t=key"
		const url = (idx !== -1) ? req.url.slice(0, idx) : req.url;
		const paths = url.split("/").filter((p) => !!p); // ["",id,""]
		console.log(paths);
		sendThread(ws, paths[0]);
	}
});

wss.on("close", () => {
	clearInterval(interval);
});