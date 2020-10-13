"use strict";
import db from "quick.db";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const Tinder = new db.table("Tinder");
import { Command } from "discord-akairo";
import { Message, MessageEmbed, MessageReaction } from "discord.js";

export default class TinderRemoveMarries extends Command {
	constructor() {
		super("tinderremovemarries", {
			args: [
				{
					id: "integer",
					type: "integer",
					otherwise: new MessageEmbed().setDescription("Provide a number. Check your tinder lists for the specific numbers").setColor("#ff0000"),
				},
			],
		});
	}
	async exec(message: Message, { integer }: { integer: number }): Promise<Message | MessageReaction | null> {
		const marries = [...new Set(Tinder.fetch(`married.${message.author.id}`))];
		if (!marries[1]) {
			return message.channel.send("Nothing to delete.");
		}
		const removedItem = marries.splice(integer, 1);
		if (!(removedItem.toString() === message.author.id) && removedItem) {
			Tinder.set(`married.${message.author.id}`, marries);
			const RemovedMember = message.client.users.cache.get(removedItem.toString());
			const userList = [...new Set(Tinder.fetch(`dating.${removedItem}`))].map(a => a);
			if (!userList || !Array.isArray(userList)) {
				return null;
			}
			const userNumber = userList.indexOf(message.author.id);
			userList.splice(userNumber, 1);
			Tinder.set(`married.${removedItem}`, userList);

			return message.channel.send(`You divorced \`${RemovedMember ? RemovedMember?.username : "Uncached user"}\`!`).then(SentMsg => {
				SentMsg.react("✅");
				return SentMsg.react("💔");
			});
		}
		else {
			return message.channel.send("Something went wrong.");
		}
	}
}