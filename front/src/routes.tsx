import App from "./app"
import Err from "./pages/err";
import Login from "./pages/login";
import Register from "./pages/register";
import Profile from "./pages/profile";
import Index from "./pages";

import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import { authLoader } from "./utils/fetch";

const router = createBrowserRouter([
	// Auth Routes
	{
		path: "/",
		element: <App/>,
		loader: () => authLoader(),
		errorElement: <Err/>,
		children: [
			{
				index: true,
				element: <Index/>,
				//loader: usersLoader | executed synchronously with authLoader (moved to useEffect)
			},
			{
				path: ":thread",
				element: <Index/>,
			},
			{
				path: "profile",
				element: <Profile/>,
			},
			{
				path: "friends",
				element: <p>F</p>,
			}
		]
	},
	// No Auth Only Routes
	{
		path: "/login",
		element: <Login/>,
		loader: () => authLoader(true),
	},
	{
		path: "/register",
		element: <Register/>,
		loader: () => authLoader(true),
	},
	{ path: "/css", element: <Index/>, } // Login bypass
], {basename: "/"}); // Deploy path

export default () => (<RouterProvider router={router}/>);
