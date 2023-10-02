import { MongoClient, Db } from "mongodb";

const uri = process.env.DB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

export let db:Db;

export async function dbConn() {
	await client.connect().catch(err => console.log(`db.ts: ${err}`));
	client.on("commandStarted", started => console.log("Started DB:", started));
	db = client.db("msg-app")
	return client;
}
