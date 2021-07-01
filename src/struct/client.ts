import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, MongooseProvider } from "discord-akairo";
import { Snowflake } from "discord-api-types";
import { Intents } from "discord.js";
import { join } from "path";
import { getBotDocument } from "./documentMethods";
import { botModel, guildsModel } from "./models";

export const prefixCache: {[index: string]: string} = {};

export class customClient extends AkairoClient {
	commandHandler: CommandHandler;
	inhibitorHandler: InhibitorHandler;
	listenerHandler: ListenerHandler;
	guildSettings: MongooseProvider;
    botSettings: MongooseProvider;
    botSettingID: string;
    constructor() {
    	super({
    		ownerID: process.env.OWNER as Snowflake,
    		allowedMentions: { parse: ["users"], repliedUser: true },
    		intents: [Intents.ALL],
    		partials: ["REACTION", "CHANNEL"],
    		shards: "auto",
    		// Uncomment to have mobile status on bot.
    		// ws: { properties: { $browser: "Discord Android" } },
    	});

    	// Mongoose Providers
    	this.guildSettings = new MongooseProvider(guildsModel);
    	this.botSettings = new MongooseProvider(botModel);

    	this.guildSettings.init();
    	this.botSettings.init();

    	this.commandHandler = new CommandHandler(this, {
    		allowMention: true,
    		automateCategories: true,
    		blockBots: true,
    		blockClient: true,
    		commandUtil: true,
    		defaultCooldown: 2500,
    		directory: join(__dirname, "../commands"),
    		fetchMembers: true,
    		handleEdits: true,
    		prefix: message => {
    			if (message.guild) {
    				let guildPrefix = prefixCache[message.guild.id];
    				if (guildPrefix) return guildPrefix;

    				guildPrefix = this.guildSettings.get(message.guild.id, "prefix", process.env.PREFIX);
    				prefixCache[message.guild.id] = guildPrefix;
    				return guildPrefix;
    			}
    			return process.env.PREFIX as string;
    		},
    	});


    	this.listenerHandler = new ListenerHandler(this, { directory: join(__dirname, "../listeners") });
    	this.inhibitorHandler = new InhibitorHandler(this, { directory: join(__dirname, "../inhibitors") });

    	this.listenerHandler.setEmitters({ commandHandler: this.commandHandler });

    	this.commandHandler.useListenerHandler(this.listenerHandler);
    	this.commandHandler.useInhibitorHandler(this.inhibitorHandler);

    	this.inhibitorHandler.loadAll();
    	this.listenerHandler.loadAll();
    	this.commandHandler.loadAll();
    }

    async init(): Promise<void> {
    	this.botSettingID = await getBotDocument()
    			.then(async m => {
    				if (m.id) {
    					return m.id;
    				}
    				else {
    					m.id = m._id;
    					m.markModified("id");
    					await m.save();
    					return m.id;
    				}
    			});
    }
}
