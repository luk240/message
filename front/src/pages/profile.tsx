import { useNavigate } from "react-router-dom";
import { logout as lo } from "../utils/fetch";

export default function Profile() {
	const navigate = useNavigate();
	async function logout() {
		const res = await lo();
		if (res.ok) navigate("/login?y");
		else return "Try again"
	}

	return (
		<div>
			<h1>Profile</h1>
			<p>You should only see this route if logged in !</p>
			<button onClick={logout}>Logout</button>
		</div>
	)
}
