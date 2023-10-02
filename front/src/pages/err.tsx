import { Link, useNavigate, useRouteError } from "react-router-dom";

export default function ErrorPage() {
	const error:any = useRouteError();
	const navigate = useNavigate()
	console.error(error);

	return (
		<div id="error-page">
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p><i>{error.statusText} {error.message}</i></p>
			<h2><span onClick={() => navigate(-1)}>Return</span> | <Link to="/">Home</Link></h2>
		</div>
	);
}

