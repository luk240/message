export interface IUser {
	username: string;
	email: string;
	password: string;
	image: string|null;
	state: {online: boolean, status: string|null};
	friends: string[]; // [id1,id2]
	conversations: number[];
	time_created: number
	time_login: number
}

export function makeUser(name:string, email:string="", password:string): IUser {
	return {
		username: name,
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
