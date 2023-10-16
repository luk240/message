declare global {
	namespace model {
		interface IUser {
			_id?: string|ObjectId;
			username: string;
			name: string; // Non uniq name
			email: string;
			password: string;
			image: string|null;
			state: {online: boolean, status: string|null};
			friends: string[]; // [id1,id2]
			conversations: number[];
			time_created: number; // Date.now()
			time_login: number; // Date.now()
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
	}
}

export interface WsGet {
	type: "pong"|"sys"|"msg";
	content?: string; // Text Or Img
}
export interface WsSend {
	type: "ping"|"sys"|"msg";
	content: string;
	name?: string;
}
