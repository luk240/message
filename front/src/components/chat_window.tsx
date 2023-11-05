import { useEffect, useState, useRef } from "react"
import "./chat_window.css"
import { useParams } from "react-router-dom";
import { msgGetC } from "../utils/fetch";
import { mdm } from "../utils/fmt_date";

interface WebSocket_ extends WebSocket {
	pingTimeout: ReturnType<typeof setTimeout>;
}
interface WsGet {
	id?: "string";
	type: "ping"|"sys"|"msg";
	content: string;
	name?: string;
	time_created?: number; // From client
}
interface WsSend {
	type: "msg";
	content: string;
}

let ws:WebSocket_|null = null;
const wsHeartbeat = 30000 + 2000; // +delay
const msgInput:WsSend = {type: "msg"} as WsSend;
let shouldScroll = true;

export default function ChatWindow() {
	let [msgLog, setMsgLog] = useState<WsGet[]>([]);
	const divMain = useRef<HTMLDivElement>(null);
	const getThread = useParams().thread || "";
	const thread = useRef(getThread);
	console.log("MSGLOG:", msgLog);

	// Change ws thread
	if (thread.current !== getThread) {
		thread.current = getThread;
		if (ws) ws.close(1000, "newid");
	}

	function heartbeat(isPing:Boolean = true) {
		if (!ws) return;
		if (ws.pingTimeout) clearTimeout(ws.pingTimeout);

		ws.pingTimeout = setTimeout(() => { // Logic to handle no res from server
			ws?.close(1000, "timeout"); // Try reconn once before 1min interval
			
			const reconn = setInterval(() => {
				if (ws?.readyState != ws?.OPEN) {
					console.log("WS server not responding", ws);
					wsInit();
				}
				else clearInterval(reconn); // If reconn fn will run 1/1 more time. Alt do clearInterval "ws.reconn" on "onopen"
			}, 59000);
		}, wsHeartbeat);

		if (isPing) ws.send(JSON.stringify({type: "pong"}));
	}

	function wsInit() {
		console.log("wsInit:", ws)
		if (ws) ws.close(1000, "reconn");
		ws = new WebSocket(import.meta.env._WS + thread.current) as WebSocket_;
		ws.onopen = () => {
			console.log("'WS connection open'");
			heartbeat(false); // Start timeout in case conn drops before first ping(30s)
			ws!.send('{"type":"sys"}'); // User connected msg
		}
		ws.onclose = (e) => {
			console.log("WS onclose:", e.reason);
			if (ws) {
				clearTimeout(ws.pingTimeout);
				switch(e.reason) {
					case "timeout": wsInit(); break;
					case "newid": msgGetC(thread.current).then((data) => {
						msgLog = data;
						wsInit();
					});
					break;
				}
			}
		}
		ws.onerror = (e) => {
			console.log("WS onerror:", e);
			//handleErr(e)
		}
		ws.onmessage = (e) => {
			console.log("WS-onmessage", e.data);
			try {
				var data:WsGet = JSON.parse(e.data);
				if (!data.hasOwnProperty("type")) throw data;
			}catch(err) {
				console.log(`WS-onmessage invalid "${e.data}":`, err);
				return;
			}

			const x = data.type;
			if (x == "ping") heartbeat(); // If wss dont receive pong it kills us & if we dont get ping we reconn.
			else if (x == "msg" || x == "sys") {
				if (divMain.current) { // Handle scroll before setting msg
					const el = divMain.current;
					shouldScroll = el.scrollHeight - (el.scrollTop+el.clientHeight) < 2;
					//console.log(el.scrollHeight, "-", el.scrollTop+el.clientHeight);
				}

				msgLog.push({...data, time_created: Date.now()}); // "setMsgLog([...msgLog, {}])" did not work.
				setMsgLog([...msgLog]); // [...obj] makes Object.is() false & triggers rerender
			}
		}
	}

	useEffect(() => {
		msgGetC(thread.current).then((data) => {
			msgLog = data;
			wsInit();
		});
		return () => {
			if (ws) {
				ws.close(1000, "return");
				ws = null;
			}
		}
		}, []);

	useEffect(() => {
		if (divMain.current) {
			const el = divMain.current
			//if (firstLoad) {el.scrollTop = el.scrollHeight; firstLoad = false}
			if (shouldScroll) el.scrollTop = el.scrollHeight; // False when scroll not at bottom
		}
	}, [msgLog]);

	function handleForm(e:React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (ws && ws.readyState === ws.OPEN) {
			ws.send(JSON.stringify(msgInput));
			msgInput.content = "";
			e.currentTarget.querySelector("input")!.value = "";
			return
		}
		alert("Connection not ready");
	}

	function tglBar() {
		const x = document.getElementById("sidebar")!;
		if (x.style.display != "none") x.style.display = "none";
		else x.style.display = "flex";
	}
	
	const api = {user:"luk"}
	const login = {user:"luk"}
	return (
		<main id="chat">
			<div id="top">
				<img alt="settings" title="Settings" src="/icon/cog.svg"/>
				<h1>Chat Room <sup>{` (${false ? "offline" : "online"})`}</sup></h1>
			</div>
			<div id="mid" ref={divMain}>
				<p>Messages displays here...</p>
				<pre id="msg-box">{msgLog.map((m, idx) =>
					<p key={idx} style={{
					background: api.user == login.user ? "cyan" : "gray"
					}}>
						{m.type == "msg" ? `${mdm(new Date(m.time_created!))} ${m.name}: ${m.content}`
						: m.type == "sys" && <i>* {m.content}</i>}
					</p>
				)}</pre>
			</div>
			<div id="bot">
				<img onClick={tglBar} tabIndex={0} alt="toggle-bar" title="Toggle Bar" src="/icon/bar.svg"/>
				<form onSubmit={handleForm}>
					<input name="msg" type="text" onChange={e => msgInput.content = e.target.value}/>
					<button type="submit">{"->"}</button>
				</form>
			</div>
		</main>
	)
}
