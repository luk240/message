import { Router } from "express";
import MSG from "./msg_dao";
import handleErr from "../utils/error";
import { authenticateTok } from "../middlewares";

const msgRouter = Router();
msgRouter.use(authenticateTok);

msgRouter.get("/c/:cid", async (req, res) => {
	try{
		const msgs = await MSG.getConvoMsgs(req.params.cid);
		res.status(200).json(msgs);
	}catch(e) {
		res.status(500).json({error: handleErr(e)});
	}
});

export default msgRouter;
