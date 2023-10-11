import { useEffect, useState, useRef } from "react"
import "./chat_window.css"

interface WebSocket_ extends WebSocket {
	pingTimeout: ReturnType<typeof setTimeout>;
}
interface WsGet {
	type: string;
	name: string;
	content: string;
}
interface WsSend extends WsGet {
	user_id: string;
	conversation_id: string;
}

export default function ChatWindow() {
	const [msg, setMsg] = useState<WsSend>({type: "msg"} as WsSend);
	const [msgLog, setMsgLog] = useState<WsGet[]>([{type: "msg", name: "XX", content: "XX"}]);
	const ws = useRef<WebSocket_|null>(null);
	const [wsTimeout, setWsTimeout] = useState<boolean>(false);
	const wsHeartbeat = 30000 + 1000; // 1s delay
	const divMain = useRef<HTMLDivElement>(null);
	const shouldScroll = useRef(true);
	console.log("MSGLOG:", msgLog);

	function heartbeat() {
		if (!ws.current) return;
		if (ws.current.pingTimeout) clearTimeout(ws.current.pingTimeout);

		ws.current.pingTimeout = setTimeout(() => {
			// Logic to handle no res from server
			ws.current!.close(1000, "timeout");
			
			// <reconn once before interval>()
			const reconn = setInterval(() => {
				console.log("server not responding", ws);
				if (ws.current?.readyState != ws.current?.OPEN) setWsTimeout((t) => !t); // needs improvement
				else clearInterval(reconn);
			}, 59000); // Try reconnect every 1min
		}, wsHeartbeat);

		ws.current.send(JSON.stringify({type: "pong"}));
	}

	useEffect(() => {
		console.log("USE EFFECT");
		if (ws.current) ws.current.close(1000, "reconn");
		ws.current = new WebSocket(import.meta.env._WS) as WebSocket_;
		ws.current.onopen = () => {
			console.log("'WS connection open'");
			const sysMsg = {type: "sys", content: "{User} connected"};
			ws.current!.send(JSON.stringify(sysMsg));
		}
		ws.current.onclose = (e) => {
			console.log("WS onclose:", e.reason);
			//if (ws.current?.pingTimeout) clearTimeout(ws.current.pingTimeout);
			//ws.current = null;
		}
		ws.current.onerror = (e) => {
			console.log("WS onerror:", e);
			//handleErr(e)
		}
		ws.current.onmessage = (e) => {
			console.log("WS-onmessage", e.data);
			try {
				var data:WsGet = JSON.parse(e.data);
				if (!data.hasOwnProperty("type")) throw data;
			}catch(err) {
				console.log(`WS-onmessage invalid "${e.data}":`, err);
				return;
			}

			switch (data.type) {
				case "ping":
					heartbeat();
				break;
				case "msg": case "sys":
					if (divMain.current) { // Handle scroll befor setting msg
						const el = divMain.current;
						shouldScroll.current = el.scrollHeight - (el.scrollTop+el.clientHeight) < 2;
						//console.log(el.scrollHeight, "-", el.scrollTop+el.clientHeight);
					}

				setMsgLog((l) => [...l, {type: data.type, name: "Anon", content: data.content}]); // Pass callback; this useEffect only runs once, thus only has access to initial values.
				break;
			}
		}
		return () => {
			if (ws.current) {
				ws.current.close(1000, "return");
				ws.current = null;
			}
		}
		}, [wsTimeout]);

	useEffect(() => {
		if (divMain.current) {
			const el = divMain.current
			//if (firstLoad) {el.scrollTop = el.scrollHeight; firstLoad = false}
			if (shouldScroll.current) el.scrollTop = el.scrollHeight; // False when scroll not at bottom
		}
	}, [msgLog]);

	function handleForm(e:React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		if (ws.current && ws.current.readyState === ws.current.OPEN) {
			ws.current.send(JSON.stringify(msg));
			msg.content = "";
			e.currentTarget.querySelector("input")!.value = "";
			//setMsgLog([...msgLog, {name: "Luk", content: msg}])
			return
		}
		alert("Connection not ready");
	}
	
	const api = {user:"luk"}
	const login = {user:"luk"}
	return (
		<main id="chat">
			<div id="top">
				<img alt="settings" title="Settings" src="/icon/cog.svg"/>
				<h1>Chat Room <sup>{` (${wsTimeout ? "offline" : "online"})`}</sup></h1>
			</div>
			<div id="mid" ref={divMain}>
				<p>Messages displays here...</p>
				<pre id="msg-box">{msgLog.map((text, idx) =>
					<p key={idx} style={{
					background: api.user == login.user ? "cyan" : "gray"
					}}>
						{text.type == "msg" ? `${text.name}: ${text.content}`
						: text.type == "sys" && <i>{text.content}</i>}
					</p>
				)}</pre>
			</div>
			<div id="bot">
				<img alt="toggle-bar" title="Toggle Bar" src="/icon/bar.svg"/>
				<form onSubmit={handleForm}>
					<input name="msg" type="text" onChange={e => msg.content = e.target.value}/>
					<button type="submit">Send!</button>
				</form>
			</div>
		</main>
	)
}
