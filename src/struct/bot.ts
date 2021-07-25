import { inject, injectable } from "inversify";
import { customClient } from "./client";
import MongoDb from "./mongoDb";
import { TYPES } from "./types";
import logger from "loglevel";

@injectable()
export class Bot {
    public client: customClient;
    private readonly token: string;

    constructor(
        @inject(TYPES.Client) client: customClient,
        @inject(TYPES.Token) token: string,
    ) {

    	this.client = client;
    	this.token = token;
    }

    public start(): Promise <string> {

    	if (!process.env.PREFIX || process.env.PREFIX === "[YOUR_PREFIX]") {
    		throw new Error("Missing prefix! Set a prefix in .env");
    	}

    	if (!process.env.OWNER || process.env.OWNER === "[YOUR_OWNER_ID]") {
    		throw new Error("Missing owner-ID! Please double-check the guide and set an owner in .env");
    	}

    	if (!process.env.KAWAIIKEY || process.env.KAWAIIKEY === "[YOUR_OPTIONAL_KAWAII_KEY]") {
    		this.client.commandHandler.deregister(this.client.commandHandler.findCommand("run"));
    		this.client.commandHandler.deregister(this.client.commandHandler.findCommand("peek"));
    		this.client.commandHandler.deregister(this.client.commandHandler.findCommand("pout"));
    		logger.warn("Kawaii API dependant commands have been disabled. Provide a token in .env to re-enable.");
    	}

    	new MongoDb().init();
    	this.client.init();

    	return this.client.login(this.token);
    }
}