export function makeUser(name:string, email:string="", password:string): model.IUser {
	return {
		username: name,
		name: name,
		email: email,
		password: password,
		image: null,
		state: {online: false, status: null}, // Handle in frontend
		friends: [],
		conversations: [],
		time_created: Date.now(),
		time_login: Date.now()
	}
}
