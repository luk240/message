interface IUser {
	_id: string;
	username: string;
	name: string; // Non uniq name
	email: string;
	password: string;
	state: {online: boolean, status: string|null};
	friends: string[]; // [id1,id2,id3]
	conversations: number[];
	time_created: number // Date.now()
	time_login: number // Date.now()
}

interface IConversation {
	_id: string;
	members: string[]; // [id1,id2,id3]
	time_created: number; // Date.now()
}

interface IMessage {
	_id: string
	coversation_id: string;
	user_id: string;
	content: string;
	time_created: number; // Date.now()
}

export interface WsSend {
	type: string;
	name: string; // Display name, = username if unset
	content: string; // Text Or Img
}

export interface WsGet extends WsSend {
	user_id: string; // Client sends id to server, rm id before sending msg back to clientS
	conversation_id: string; // Rm before sending back
}
