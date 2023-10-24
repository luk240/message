import { createContext } from "react";
import { Outlet, useLoaderData } from "react-router-dom";

export const UserContext = createContext<null|Object>(null);

export default function App() {
	const user:any = useLoaderData();

	return (
		<UserContext.Provider value={user}>
		{user && <Outlet/>}
		</UserContext.Provider>
	)
}
