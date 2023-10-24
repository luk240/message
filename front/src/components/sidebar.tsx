import { Link } from "react-router-dom";
import "./sidebar.css";
import { convoGet, searchUsers } from "../utils/fetch";
import { useEffect, useState } from "react";
import { convoNew } from "../utils/fetch";

interface Convo {
	cid: string;
	name: string;
}
interface usrSearch {
	id: string;
	username: string;
}

let convos:Convo[] = []
let toId:number;

export default function Sidebar() {
	const [shownConvos, setShownConvos] = useState<any[]>([]);
	const [qUsers, setQUsers] = useState<usrSearch[]>([]);

	function sortUsers(input:string) {
		if (/[^a-z0-9.-_]/.test(input)) return "Invalid name";

		input.replace(/\./g, "\\.");
		const r = new RegExp(`^.?.?${input}.*`, "i");
		const res = convos.filter(u => r.test(u.name));

		console.log(res);
		setShownConvos(res);
	}

	function convoNew_(id:string) {
		convoNew(id).then(data => {
			convos.unshift(data);
			setShownConvos([...convos]);
		});
	}

	function searchUsers_(e:React.ChangeEvent<HTMLInputElement>) {
		clearTimeout(toId);
		const q = e.target.value;
		if (!q) setQUsers([]);
		toId = setTimeout(() => {
			if (q.length < 2) return "Query too short";
			searchUsers(q).then(data => setQUsers(data));
		}, 500);
	}

	function tglPopup() {
		const x = document.getElementById("popup")!;
		if (x.style.display == "block") x.style.display = "none";
		else {
			x.style.display = "block";
			document.getElementById("u-search")!.focus();
		}
	}

	useEffect(() => {
		convoGet().then((data) => {
			convos = data;
			setShownConvos(convos);
		});
	}, []);

	return (
		<div id="sidebar">
			<div>
				<input
					onChange={(e) => sortUsers(e.target.value)}
					aria-label="Find conversation"
					placeholder="Find"
					type="search"
				/>
			</div>
			<div id="header">
				<h2>Conversations</h2>
				<button onClick={tglPopup} type="submit">New</button>
			</div>
			<nav>
			{shownConvos.length ?
				<ul>
				{shownConvos.map(c => (
					<li key={c.cid}>
						<Link to={`/${c.cid}`}>
							<span>{c.name}</span>
							<span>{c.friend && "F"}</span>
						</Link>
					</li>
				))}
				</ul>
			:	<p><i>Empty...</i></p>
			}
			</nav>
			<div id="manage">
				<button>Friends</button>
				<Link to="/profile"><button>Profile</button></Link>
			</div>
			<section id="popup">
				<div>
					<input id="u-search" onChange={searchUsers_} aria-label="Find by name"
						placeholder="Name ?"
						type="search"
						name="q"
					/>
					<button onClick={tglPopup} tabIndex={0} id="x">
						<div></div>
						<div></div>
					</button>
					{qUsers.length ?
					<div id="search-res">
					{qUsers.map(u => (
						<div key={u.id}>
							<p>{u.username}</p>
							<button onClick={() => {convoNew_(u.id); tglPopup()} }>Message</button>
						</div>
					))}
					</div>
					: (
						<>
						<p>Start typing to search</p>
						<div id="search-spinner" aria-hidden hidden={false}/>
						</>
						)
					}
				</div>
			</section>
		</div>
	);
}
