import { Argument, Category, Command, PrefixSupplier } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import { name, repository, version } from "../../../package.json";
import { noArgGeneric } from "../../lib/Embeds";
import { KaikiCommand } from "kaiki";


export default class commandsList extends KaikiCommand {
	constructor() {
		super("cmdlist", {
			aliases: ["commands", "cmds", "cmdlist"],
			description: "Shows categories, or commands if provided with a category.",
			usage: ["", "admin"],
			args: [
				{
					id: "category",
					type: Argument.union((_, phrase) => {
						return this.handler.categories.find((__, k) => {

							k = k.toLowerCase();

							return phrase
								.toLowerCase()
								.startsWith(k.slice(0, Math.max(phrase.length - 1, 1)));
						});
					}, (__, _phrase) => _phrase.length <= 0
						? ""
						: undefined),
					// Thanks js
					otherwise: (msg: Message) => noArgGeneric(msg),

				},
			],
		});
	}

	public async exec(message: Message, { category }: { category: Category<string, Command>}): Promise<Message | undefined> {

		const prefix = (this.handler.prefix as PrefixSupplier)(message);

		if (category) {
			return message.channel.send({ embeds: [new MessageEmbed()
				.setTitle(`Commands in ${category.id}`)
				.setDescription(category
					.filter(cmd => cmd.aliases.length > 0)
					.map(cmd => `**${prefix}${cmd}** [\`${cmd.aliases
						.sort((a, b) => b.length - a.length
							|| a.localeCompare(b)).join("`, `")}\`]`)
					.join("\n") || "Empty")
				.withOkColor(message)] });
		}

		else {
			const embed = new MessageEmbed({
				title: "Command categories",
				description: `\`${prefix}cmds <category>\` returns all commands in the category.`,
				author: {
					name: `${name} v${version}`,
					url: repository.url,
					icon_url: message.author.displayAvatarURL({ dynamic: true }),
				},
				thumbnail: {
					url: "https://cdn.discordapp.com/attachments/717045690022363229/726600392107884646/3391ce4715f3c814d6067911438e5bf7.png",
				},
				footer: {
					icon_url: (message.client.users.cache.get("140788173885276160") || (await message.client.users.fetch("140788173885276160", { cache: true })))
						.displayAvatarURL({ dynamic: true }),
				},
			})
				.withOkColor(message);

			for (const _category of this.handler.categories.values()) {
				if (["default", "Etc"].includes(_category.id)) continue;

				embed.addField(_category.id, `Commands: **${_category.filter(c => !!c.aliases.length).size}**`, true);
			}
			return message.channel.send({ embeds: [embed] });
		}
	}
}
