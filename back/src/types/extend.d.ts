import { WebSocket } from "ws";

declare global {
	declare namespace Express {
		interface Request {
			tok: {id:string, [k:string]: any}
		}
	}
}

declare module "ws" {
	interface WebSocket {
		isAlive: boolean;
		usr: {
			id: string;
			name: string;
		}
	}
}

declare module "http" {
	interface IncomingMessage {
			tok: {id:string, [k:string]: any}
		}
}
