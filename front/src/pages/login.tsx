import { Link, useNavigate } from "react-router-dom";
import Button from "../components/button";
import { formPost } from "../utils/fetch";
import { useState } from "react";

export default function Login() {
	const navigate = useNavigate();
	const [err, setErr] = useState<string[]|string|null>(null);

	const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
		setErr(null);
		formPost(e, "user/login/").then((data) => {
			console.log("Form Res:", data);
			if (typeof data === "string") navigate("/", {replace: true});
			setErr(data.error);
		});
	}

	return (
		<div id="logreg">
			{window.location.search == "?~" && <p>You must first login.</p>}
			{window.location.search == "?y" && <p>Successfully logged out.</p>}
			<h1>Login</h1>
			<form onSubmit={handleSubmit}>
				<label>Username/Email:
					<input name="cred" type="text" placeholder="Username/Email"/>
				</label>
				<label>Password:
					<input name="password" type="password" placeholder="Password"/>
				</label>
				<Button type="submit">Login!</Button>
			</form>
			<p>Dont have an account? <Link to="/Register">Register.</Link></p>
			{err && <div className="form-err">
				{ typeof err == "string" ? <p>{err}</p> : err.length>0 &&
				err.map((e, idx) => <p key={idx}>{e}</p>) }
			</div>}
		</div>
	)
}
