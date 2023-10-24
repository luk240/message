import { db } from "./db";
import { makeUser } from "./app/user/user";

const p = "$2a$04$JxZ2wxZiSd9E3.BznTPKP.7qO/n5AYMqYxWJt1m8KclbNzxNtaIOa" // 1

db.dropDatabase();
db.collection("users").countDocuments({}, {limit: 1}).then(x => {
	if (x === 0)
		db.collection("users").insertMany([
			makeUser("usr1", "1@2.com", p),
			makeUser("usr2", "2@2.com", p),
			makeUser("usr3", "3@3.com", p),
			{...makeUser("admin", "a@a.com", p), admin: 1},
		]).then((res) => {
			console.log("Data seeded:", res); process.exit(0);
		}).catch(e => {
			console.log("Seed Failed:", e); process.exit(1);
		});
});
