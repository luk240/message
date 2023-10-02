import { useLoaderData } from "react-router-dom"

export default function Profile() {
	const data = useLoaderData();
	console.log("useLoaderData:", data);
	return (
		<div>
			<h1>Profile</h1>
			<p>You should only see this route if logged in !</p>
		</div>
	)
}
