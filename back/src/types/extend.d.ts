import { WebSocket } from "ws";

declare global {
	declare namespace Express {
		interface Request {
			tok: {id:string, [k:string]: any}
		}
	}
}

declare module "ws" {
	export interface WebSocket {
		isAlive?: boolean;
	}
}
