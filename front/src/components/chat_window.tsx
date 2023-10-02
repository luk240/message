import { useEffect, useState, useRef } from "react"
import "./chat_window.css"

interface Message {
	name: string;
	content: string;
}

/*
let ws:WebSocket
function wsInit() {
	if (ws) ws.close;
	ws = new WebSocket("ws://localhost:5000");

	ws.onopen = () => {
		console.log("WS: connection open")
		ws.send("WS: client connected")
	}
	ws.onclose = () => {
		console.log("WS: connection closed")
	}
	ws.onmessage = ({data}) => {
		console.log("WS:", data)
		//setMsgLog([...msgLog, {name: "Anon", content: data}])
	}
}
*/

export default function ChatWindow() {
	const [msg, setMsg] = useState("")
	const [msgLog, setMsgLog] = useState<Message[]>([{name: "XX", content: "XX"}])
	const ws = useRef<WebSocket|null>(null)
	console.log("MSGLOG:", msgLog)

	useEffect(() => {
		if (ws.current == null) {
			ws.current = new WebSocket(import.meta.env._WS) // ws://localhost:5000
			ws.current.onopen = () => {
				console.log("WS: connection open")
				//ws.current.send("WS: client connected")
			}
			ws.current.onclose = () => {
				console.log("WS: connection closed")
				//ws.current = null
			}
			ws.current.onmessage = ({data}) => { // Closure
					console.log("OnMessage:", data)
					console.log("WSLOG:", msgLog)
					setMsgLog((l) => [...l, {name: "Anon", content: data}]) // Pass callback; this useEffect only runs once, thus only has access to initial values.
			}
		}
		return () => {
			if (ws.current) {
				ws.current.close();
				ws.current = null;
			}
		};
	}, [])

	function handleForm(e:React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		ws.current!.send(msg);
		setMsg("")
		//setMsgLog([...msgLog, {name: "Luk", content: msg}])
	}
	
	const api = {user:"luk"}
	const login = {user:"luk"}
	return (
		<main id="chat">
			<div id="top">
				<img alt="settings" title="Settings" src="/icon/cog.svg"/>
				<h1>Chat Room</h1>
			</div>
			<div id="mid">
				<p>Messages displays here...</p>
				<pre id="msg-box">{msgLog.map((text, idx) =>
					<p key={idx} style={{
						background: api.user == login.user ? "cyan" : "gray"
						}}>
						{text.name}: {text.content}</p>
				)}</pre>
			</div>
			<div id="bot">
				<img alt="toggle-bar" title="Toggle Bar" src="/icon/bar.svg"/>
				<form onSubmit={handleForm}>
					<input name="msg" type="text" value={msg} onChange={e => setMsg(e.target.value)}/>
					<button type="submit">Send!</button>
				</form>
			</div>
		</main>
	)
}
