import { Router } from "express";
import { makeUser } from "./user";
import USER from "./user_dao";
import handleErr from "../utils/error";
import { authenticateTok, bodyIsString, valLogin, valReg } from "../middlewares";
import { getCookies, setCookie } from "../utils/cookie";
import { genToken } from "../utils/token";

const userRouter = Router();

userRouter.post("/register", bodyIsString, valReg, async (req, res) => {
	console.log("body: ", req.body)
	try {
		let user = makeUser(req.body.username, req.body.email, req.body.password);
		const uid = await USER.regUser(user);
		const tok = genToken(uid);
		setCookie("tok", tok, res);
		res.status(201).send(user.username);
	}catch(e) {
		res.status(500).json({error: handleErr(e)});
	}
});

userRouter.post("/login", bodyIsString, valLogin, async (req, res) => {
	console.log("body: ", req.body)
		try {
			const user = await USER.loginUser(req.body);
			const tok = genToken(user._id.toString());
			setCookie("tok", tok, res);
			res.status(200).send(user.username);
		}catch(e) {
			e = handleErr(e);
			const code = (e == "Bad credentials") ? 400 : 500;
			res.status(code).json({error: e});
		}
});

/* Auth routes */

userRouter.get("/auth", authenticateTok, async (req, res) => {
	try{
		const name = await USER.getUserName(req.tok.id);
		res.status(200).send(name);
	}catch(e) {
		res.status(500).json({error: handleErr(e)});
	}
});

userRouter.get("/users", authenticateTok, async (_, res) => {
	try {
		const users = await USER.getAllUsers();
		res.json(users);
	} catch(e:any) {
		res.status(500).json({error: handleErr(e)});
	}
});


userRouter.get("/setcok", (_, res) => {
	setCookie("myCookie", "pingu", res);
	res.end("Cookie SET")
});
userRouter.get("/setcok1", (req, res) => {
	if (req.headers.cookie) {
		const cookies = getCookies<{tok:string}>(req.headers.cookie)
		res.json(cookies)
	}
});

export default userRouter;
