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
			convo_id: ObjectId;
			user_id: ObjectId;
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
	id?: ObjectId;
	type: "sys"|"msg";
	content: string;
	name?: string;
}

export interface ConvoNew {
	cid: ObjectId;
	name: string;
}
