import { MongoClient, Db } from "mongodb";

const uri = process.env.DB_URI || "mongodb://localhost:27017";
const client = new MongoClient(uri);

export let db:Db;

export async function dbConn() {
	await client.connect()
		.then(() => console.log(`DB connected: ${uri}`))
		.catch(err => { console.log(`db.ts: ${err}`); process.exit(1) });
	db = client.db("msg-app");
	return client;
}
