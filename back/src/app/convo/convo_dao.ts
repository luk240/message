import { db } from "../../db";
import { ConvoNew } from "../../types";
import USER from "../user/user_dao";
import { ObjectId } from "mongodb";

interface IConvoDao {
	newConvo(convo: model.IConvo): void;
}

class ConvoDao implements IConvoDao {
	public readonly db = db.collection<model.IConvo>("convos");

	// Convos w/o a name will show username(s)
	async getConvos(uid:string|ObjectId): Promise<ConvoNew[]> {
		uid = new ObjectId(uid);

		// All convos w/o self-uid sorted by last msg
		const convos = await this.db.aggregate([
			{$match: {"members": uid}},
			{$set: {
				"cid": "$_id",
				"members": {
					$filter: {
						input: "$members",
						as: "m",
						cond: {
							$ne: ["$$m", uid]
						}
					}
				}
			}},
			{$project: {"_id": 0}}
		]).sort({"time_lastmsg": -1}).toArray();
		if (convos.length === 0) throw Error("No convos found");

		// All users with common convos
		let userIds:ObjectId[] = [];
		for (let c of convos) {
			c.members.forEach((id:ObjectId) => {
				if (!userIds.includes(id)) userIds.push(id);
			});
		}
		const users = await USER.db.find({ "_id": {$in: userIds} }, { projection: {"_id": 1, "username": 1} }).toArray();
		
		// Generate name from members if empty
		for (let c of convos) {
			if (c.name !== "") continue;
			for (let u of users) {
				if ( !c.members.some((i:ObjectId) => JSON.stringify(i) == JSON.stringify(u._id)) ) continue;

				c.name += u.username + ", ";
			}
			c.name = c.name.slice(0, -2); // ", "
		}

		//console.log("C:", convos);
		return convos as ConvoNew[];
	}
	
	async newConvo(convo: model.IConvo): Promise<ConvoNew> {
		convo.members = convo.members.map(id => new ObjectId(id));
		const user = await USER.db.findOne({"_id": convo.members[1]}, {projection: {"_id": 0, username: 1}});
		if (!user) throw Error("User not found");

		const res = await this.db.insertOne(convo);
		if (!res.acknowledged) throw Error("Failed creating conversation");
		USER.db.updateMany({"_id": {$in: convo.members}}, {$push: {"convos": res.insertedId}});

		return {cid: res.insertedId, name: user.username}
	}
}

export default new ConvoDao();
