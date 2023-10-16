import { db } from "../../db";
import bcrypt from "bcrypt"; // Replace with native crypto?
import { ObjectId } from "mongodb";

const table = "users";

interface IUserDao {
	regUser(user: model.IUser): Promise<string>;
	getUser(id: string): Promise<model.IUser|null>;
	getAllUsers(): Promise<model.IUser[]>;
}

class UserDao implements IUserDao {
	async regUser(user: model.IUser) {
		const salt = await bcrypt.genSalt(9);
		user.password = await bcrypt.hash(user.password, salt);
		const res = await db.collection<model.IUser>(table).insertOne(user);

		console.log(`${user.username} registered: ${res.acknowledged}`);
		console.log(res.insertedId, res.insertedId.toString());
		return res.insertedId.toString();
	}

	async loginUser({cred, password}:{cred: string, password: string,}) {
		const user = await db.collection<model.IUser>(table).findOne({$or: [{"username": cred}, {"email": cred}]});
		if (user && await bcrypt.compare(password, user.password)) return user;
		throw Error("Bad credentials")
	}

	async getUser(id: string) {
		const result = await db.collection<model.IUser>(table).findOne({"_id": new ObjectId(id)});
		if (!result) throw Error("Could not retrive users");
		return result;
	}

	async getUserName(id:string) {
		const user = await this.getUser(id);
		return user.username;
	}

	async getAllUsers() {
		const cursor = db.collection<model.IUser>(table).find({});
		const users = await cursor.toArray();
		return users;
	}
}

export default new UserDao();
