import { Link } from "react-router-dom";
import "./sidebar.css";

export default function Sidebar() {
	return (
		<div id="sidebar">
			<div id="find">
				<form id="search-form" role="search">
					<input id="q"
						aria-label="Search users"
						placeholder="Search"
						type="search"
						name="q"
					/>
					<div id="search-spinner" aria-hidden hidden={true}/>
				</form>
				<form method="post">
					<button type="submit">users/conv</button>
				</form>
			</div>
			<nav>
				<h2>Conversations</h2>
				<ul>
					<li>
						<a className="active" href={`/chat/1`}>Friend1</a>
					</li>
					<li>
						<Link to={`/123`}>Friend1, Friend2 ...</Link>
					</li>
					<li>
						<Link to={`/456`}>Group Name</Link>
					</li>
				</ul>
			</nav>
			<div id="manage">
				<button>Friends</button>
				<Link to="/profile"><button>Profile</button></Link>
			</div>
		</div>
	);
}
