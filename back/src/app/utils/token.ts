import jwt from "jsonwebtoken";

export function genToken(id:string) {
	const tok = jwt.sign({"id": id}, process.env.TOK_SECRET!, {algorithm: "HS256", expiresIn: "2d"});
	console.log("GEN_TOK", tok);
	return tok;
}
