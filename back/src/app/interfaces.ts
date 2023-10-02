interface IUser {
	username: string;
	email: string;
	password: string;
	state: {online: boolean, status: string|null};
	friends: string[]; // [id1,id2,id3]
	conversations: number[];
	time_created: number // Date.now()
	time_login: number // Date.now()
}

interface IConversation {
	id: number;
	members: string[]; // [id1,id2,id3]
	time_created: number; // Date.now()
}

interface IMessage {
	coversation_id: 123;
	username_id: string;
	content: string;
	time_created: number; // Date.now()
}
