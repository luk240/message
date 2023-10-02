import {Response} from "express";

export function setCookie(k:string, v:string, res:Response) {
	// Eq to: res.setHeader("Set-Cookie", "key=value;SameSite=Lax");
	res.cookie(k, v, {sameSite: "lax", httpOnly: true, expires: new Date(Date.now() + 3600000*24 * 7)})
}

export function getCookies<T>(cookies:string) {
	const c_arr = cookies.replace(/\s/g, "").split(";")

	let c_obj:any = {};
	for (let c of c_arr) {
		let [k,v] = c.split("=");
		c_obj[k] = v;
	}

	return c_obj as T;
}
