declare global {
	namespace model {
		interface IUser {
			_id?: ObjectId;
			username: string;
			name: string; // Non uniq name
			email: string;
			password: string;
			image: string|null;
			state: {online: boolean, status: string|null};
			friends: ObjectId[]; // [id1,id2]
			convos: ObjectId[];
			time_created: number; // Date.now()
			time_login: number; // Date.now()
		}
		interface IConvo {
			_id?: ObjectId;
			name: string;
			members: string[]|ObjectId[]; // [id1,id2,id3]
			time_created: number; // Date.now()
			time_lastmsg: number; // Date.now()
		}
		interface IMessage {
			_id?: ObjectId;
			convo_id: string;
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

export interface ConvoNew {
	cid: ObjectId;
	name: string;
}
