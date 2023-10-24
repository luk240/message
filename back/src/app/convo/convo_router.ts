import { Router } from "express";
import { makeConvo } from "./convo";
import CONVO from "./convo_dao";
import handleErr from "../utils/error";
import { authenticateTok } from "../middlewares";

const convoRouter = Router();
convoRouter.use(authenticateTok);

convoRouter.get("/get", async (req, res) => {
	try{
		const convos = await CONVO.getConvos(req.tok.id);
		res.status(200).json(convos);
	}catch(e) {
		res.status(500).json({error: handleErr(e)});
	}
});

convoRouter.post("/new", async (req, res) => {
	try{
		const convo = makeConvo();
		convo.members = [req.tok.id, req.body.uid];
		const convoInfo = await CONVO.newConvo(convo);
		res.status(201).json(convoInfo);
	}catch(e) {
		res.status(500).json({error: handleErr(e)});
	}
});

export default convoRouter;
