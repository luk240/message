import { createContext } from "react";
import { Outlet, useLoaderData } from "react-router-dom";
import { IUser } from "./utils";

export const UserContext = createContext<IUser>({} as IUser);

export default function App() {
	const user:IUser = useLoaderData() as any;

	return (
		<UserContext.Provider value={user}>
		{user && <Outlet/>}
		</UserContext.Provider>
	)
}
