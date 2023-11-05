import { db } from "../../db";
import { WsSend } from "../../types";
import USER from "../user/user_dao";
import { ObjectId } from "mongodb";

interface IMessageDao {
	storeMsg(cid:string, uid: string, content:string, _id:ObjectId): void;
}

class MsgDao implements IMessageDao {
	public readonly db = db.collection<model.IMessage>("messages");

	async storeMsg(cid:string, uid: string, content:string, _id:ObjectId) {
		if (!ObjectId.isValid(cid)) return;

		const newMsg:model.IMessage = {
			_id,
			convo_id: new ObjectId(cid),
			user_id: new ObjectId(uid),
			content,
			time_created: Date.now()
		}
		
		const res = await this.db.insertOne(newMsg);
		if (!res.acknowledged) throw Error("Message not saved");
	}

	async getConvoMsgs(cid:string) {

		if (!ObjectId.isValid(cid)) return;

		const msgs = await this.db.find({"convo_id": new ObjectId(cid) }, { projection: {_id: 0, id: "$_id", user_id: 1, type: "msg", content: 1, time_created: 1} })
			.sort({"time_created": 1}).toArray() as unknown as Omit<model.IMessage & {id: string, type: "msg"}, "_id"|"convo_id">[];
		if (msgs.length === 0) return [];

		const userIds:ObjectId[] = [];
		for (let m of msgs) {
			if (!userIds.some(i => JSON.stringify(i) == JSON.stringify(m.user_id)) ) userIds.push(m.user_id);
		}
		const users = await USER.db.find({ "_id": {$in: userIds} }, { projection: {"_id": 1, "username": 1} }).toArray();

		// Add name & rm uid
		const namedMsgs:any[] = msgs;
		for (let m of namedMsgs) {
			for (let u of users) {
				if (JSON.stringify(m.user_id) == JSON.stringify(u._id)) {
					m.name = u.username; delete m.user_id;
					break;
				}
			}
		}

		//console.log(namedMsgs);
		return namedMsgs as WsSend[] & {time_created: number};
	}
}

export default new MsgDao();
