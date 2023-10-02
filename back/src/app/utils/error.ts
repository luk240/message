export default function handleErr(e:unknown) {
	let message;

	if (e instanceof Error || (e && typeof e == "object" && "message" in e))
		message = e.message;
	else if (e && typeof e == "string") message = e;
	else message = "Unknown error occured";
	
	console.log("ERROR:", e); // Keep in mind that in res "message" property is "error"
	return message;
}
