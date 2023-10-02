import { Link, useNavigate } from "react-router-dom";
import Button from "../components/button";
import { formPost } from "../utils/fetch";
import { useState } from "react";


export default function Register() {
	const navigate = useNavigate();
	const [err, setErr] = useState<string[]|string|null>(null);

	const handleSubmit = (e:React.FormEvent<HTMLFormElement>) => {
		setErr([]);
		formPost(e, "user/register/").then((data) => {
			console.log("Form Res:", data);
			if (typeof data === "string") navigate("/", {replace: true});
			setErr(data.error);
		});
	}

	return (
		<div>
			<h1>Register</h1>
			<form onSubmit={handleSubmit}>
				<label>Username:
					<input name="username" type="text" placeholder="Username"/>
				</label>
				<label>Email:
					<input name="email" type="text" placeholder="Email"/>
				</label>
				<label>Password:
					<input name="password" type="text" placeholder="Password"/>
				</label>
				<Button type="submit">Register!</Button>
			</form>
			<p>Already registered? <Link to="/login">Login.</Link></p>
			{err && ((typeof err == "string") ? <div><p>{err}</p></div> : err.length>0 &&
				<div className="form-err">{ err.map((e, idx) => <p key={idx}>{e}</p>) }</div>)}
		</div>
	)
}
