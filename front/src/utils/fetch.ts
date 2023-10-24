import { redirect } from "react-router-dom";

const url = import.meta.env._API || "http://localhost:5000/"

// USERS \\

export function formPost(e:React.FormEvent<HTMLFormElement>, path:string) {
	e.preventDefault();
	const form = e.currentTarget;
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
		const data = await res.json();
		return data;
	}catch(e) {
		console.log("AUTH ERR:", e);
	}
}

export async function searchUsers(q:string) {
	console.log("searchUsers");
	try {
		const res = await fetch(url+"user/search/"+q, {
			method: "GET",
			mode: "cors",
			credentials: "include"
		});
		const data = await res.json();
		return data;
	}catch(e) {
		console.log(e);
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
		return res.json(); // user
	}catch(e) {
		console.log("tryCatch:", e);
		if (cd) return null; // No redirect if on login/register
		return redirect("/login?~");
	}
}

export function logout() {
	return fetch(url+"user/logout", {mode: "cors", credentials: "include"});
}

// CONVO \\

export async function convoGet() {
	console.log("convoLoader");
	try {
		const res = await fetch(url+"convo/get", {
			method: "GET",
			mode: "cors",
			credentials: "include"
		});

		if (!res.ok) return [];
		const data = await res.json();

		return data;
	}catch(e) {
		console.log(e);
	}
}

export async function convoNew(uid:string) {
	console.log("convoNew");
	try {
		const res = await fetch(url+"convo/new", {
			method: "POST",
			body: JSON.stringify({uid: uid}),
			headers: {"Content-Type": "application/json"},
			mode: "cors",
			credentials: "include"
		});
		const data = await res.json();
		return data;
	}catch(e) {
		console.log(e);
	}
}
