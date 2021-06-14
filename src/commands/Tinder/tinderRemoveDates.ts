import { Command } from "@cataclym/discord-akairo";
import { Snowflake } from "discord-api-types";
import { Message, MessageEmbed } from "discord.js";
import { ITinder } from "../../interfaces/IDocuments";
import { errorMessage } from "../../lib/Embeds";
import { getTinderDocument } from "../../struct/documentMethods";

export default class TinderRemoveDates extends Command {
	constructor() {
		super("tinderremovedates", {
			args: [
				{
					id: "integer",
					type: "integer",
					otherwise: (m: Message) => errorMessage(m, "Provide a number. Check your tinder lists for the specific numbers"),
				},
			],
		});
	}
	public async exec(message: Message, { integer }: { integer: number }): Promise<ITinder> {
		const db = await getTinderDocument(message.author.id);

		if (db.datingIDs.length) {

			if (db.datingIDs.length >= integer) {
				const userID = db.datingIDs.splice(integer, 1),
					RemovedMember = message.client.users.cache.get(userID[0] as Snowflake),
					rDB = await getTinderDocument(RemovedMember?.id ?? userID[0]),
					userNumber = rDB.datingIDs.indexOf(message.author.id);

				if (userNumber !== -1) {
					rDB.datingIDs.splice(userNumber, 1);
				}

				message.channel.send(`You stopped dating ${RemovedMember ? RemovedMember?.username : "<@" + userID + ">"}.`).then(SentMsg => {
					SentMsg.react("✅");
					SentMsg.react("💔");
				});
				rDB.markModified("datingIDs");
				rDB.save();
			}
			else {
				message.channel.send(new MessageEmbed()
					.setDescription("Please provide a valid number.")
					.withErrorColor(message),
				);
			}
		}
		else {
			message.channel.send("Nothing to delete.");
		}
		db.markModified("datingIDs");
		return db.save();
	}
}