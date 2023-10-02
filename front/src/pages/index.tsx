import ChatWindow from "../components/chat_window";
import Sidebar from "../components/sidebar";
import { useEffect, useState } from "react";
import { getUsers } from "../utils/fetch";

export default function Index() {
	const [users, setUsers] = useState<any>();
	console.log("users", users);

	useEffect(() => {
		getUsers().then((data) => {
			setUsers(data);
		});
	}, []);

	return (
		<div id="index">
			<Sidebar/>
			<ChatWindow/>
		</div>
	)
}

