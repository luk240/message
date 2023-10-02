import { redirect } from "react-router-dom";

const url = import.meta.env._API || "http://localhost:5000/"

export function formPost(e:React.FormEvent<HTMLFormElement>, path:string) {
	e.preventDefault();
	const form = e.target as HTMLFormElement;
	const field:NodeListOf<any> = form.querySelectorAll("[name]");
	let body:{[k:string]: string|number} = {};

	field.forEach(({name, value}) => {
		body[name] = value;
	});
	console.log("POSTING:", body);

	return fetch(url+path, {
		method: "POST",
		body: JSON.stringify(body),
		headers: {"Content-Type": "application/json"},
		mode: "cors",
		credentials: "include", // withCredentials required for cookies
	}).then((res) => {
		if (!res.ok) return res.json();
		return res.text(); // username
	}).then((data) => {
		return data;
	}).catch((e) => {
		console.error("tryCatch:", e);
	}).finally(() => {
		console.log("Fetch finally")
	});
}

export async function getUsers() {
	console.log("getUsers");
	try {
		const res = await fetch(url+"user/users", {
			method: "GET",
			mode: "cors",
			credentials: "include"
		});
		const data = await res.json(); // username
		return data;
	}catch(e) {
		console.log("AUTH ERR:", e);
	}
}

export async function authLoader(cd:boolean = false) {
	console.log("authLoader");
	try {
		const res = await fetch(url+"user/auth", {
			method: "GET",
			mode: "cors",
			credentials: "include"
		});
		console.log("RES:", res);

		if (res.status == 401 || !res.ok) {
			throw Error("Cookie expired");
		}

		if (cd) return redirect("/"); // Fn is called again after redirect
		return res.text(); // username
	}catch(e) {
		console.log("tryCatch:", e);
		if (cd) return null; // No redirect if on login/register
		return redirect("/login?~");
	}
}

export async function errLoader() {
	console.log("errLoader");
		const res = await fetch(url+"noexist", {
			credentials: "include"
		});
		console.log("RES:",res);
		throw Error("This happens before bad res?");
		return res;
}
