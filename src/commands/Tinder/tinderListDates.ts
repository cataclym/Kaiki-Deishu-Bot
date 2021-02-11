import { separateTinderList } from "../../nsb/Tinder.js";
import { Command } from "@cataclym/discord-akairo";
import { Message } from "discord.js";
import { getTinderDB } from "../../struct/db.js";

module.exports = class TinderListDatesCommand extends Command {
	constructor() {
		super("tinderlistdates", {
		});
	}

	public async exec(message: Message) {
		const db = await getTinderDB(message.author.id),
			datingIDs = [...new Set(db.tinderData.datingIDs)];
		return separateTinderList(message, datingIDs, `Dates (${datingIDs.length})`);
	}
};