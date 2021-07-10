import { Argument, Flag, PrefixSupplier } from "discord-akairo";
import { sendPaginatedMessage } from "@cataclym/discord.js-pagination-ts-nsb";
import { Message, MessageEmbed } from "discord.js";
import { trim } from "../../lib/Util";
import { getUserDocument } from "../../struct/documentMethods";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class TodoCommand extends KaikiCommand {
	constructor() {
		super("todo", {
			aliases: ["todo", "note"],
			description: "A personal todo list. The items are limited to 204 characters. Intended for small notes, not detailed cooking recipies.",
			usage: ["", "add make cake 07/07/2020", "remove 5", "remove last", "remove first", "remove all", "rm 1"],
		});
	}
	*args(): unknown {
		const method = yield {
			type: [
				["add"],
				["remove", "rem", "delete", "del", "rm"],
			],
		};
		if (!Argument.isFailure(method)) {
			return Flag.continue(method);
		}
	}

	public async exec(message: Message): Promise<void> {
		const userDB = await getUserDocument(message.author.id),
			{ todo } = userDB, pages = [],
			reminderArray = (todo.length
				? todo.map((str) => trim(str.split(/\r?\n/).join(" "), 204))
				: ["Empty list"]);

		for (let index = 10, p = 0; p < reminderArray.length; index += 10, p += 10) {
			const embed = new MessageEmbed()
				.setTitle("Todo")
				.setAuthor(`${message.author.tag} 📔 To learn more about the command, type \`${(this.handler.prefix as PrefixSupplier)(message)}help todo\``)
				.setThumbnail("https://cdn.discordapp.com/attachments/717045690022363229/726600392107884646/3391ce4715f3c814d6067911438e5bf7.png")
				.setDescription(reminderArray.map((item: string, i: number) => `${+i + 1}. ${item}`).slice(p, index).join("\n"))
				.withOkColor(message);
			pages.push(embed);
		}

		await sendPaginatedMessage(message, pages, {});
	}
};
