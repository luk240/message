import React from "react"
import ReactDOM from "react-dom/client"
import Routes from "./routes";
import "./index.css";
import "./pages/logreg.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		{/*<App/>*/}
		<Routes/>
	</React.StrictMode>,
)
