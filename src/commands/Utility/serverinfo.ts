import { PrefixSupplier } from "discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { KaikiCommand } from "kaiki";
import { guildFeatures } from "../../struct/constants";
import { time } from "@discordjs/builders";

export default class ServerInfoCommand extends KaikiCommand {
	constructor() {
		super("serverinfo", {
			aliases: ["serverinfo", "sinfo"],
			description: "Shows information about the current server.",
			args: [
				{
					id: "guild",
					type: "guild",
					default: (message: Message) => message.guild,
				},
			],
		});
	}
	public async exec(message: Message, { guild }: { guild: Guild }): Promise<Message> {

		const emb = new MessageEmbed({
			thumbnail: { url: <string> guild?.iconURL({ format: "png", size: 2048, dynamic: true }) },
			title: `${guild.name} [${guild.id}]`,
			author: { name: "Server info" },
			fields: [
				{ name: "Owner", value: message.client.users.cache.get(guild.ownerId)?.tag ?? guild.ownerId, inline: true },
				{ name: "Members", value: String(guild?.memberCount), inline: true },
				{ name:
                    "Channels", value: "Text: **" + guild?.channels.cache.filter((channel) => channel.type === "GUILD_TEXT").size +
                    "**\nVoice: **" + guild?.channels.cache.filter((channel) => channel.type === "GUILD_VOICE").size +
                    "**\nCategories: **" + guild?.channels.cache.filter((channel) => channel.type === "GUILD_CATEGORY").size +
                    "**\nNews: **" + guild?.channels.cache.filter((channel) => channel.type === "GUILD_NEWS").size +
                    "**\nStore: **" + guild?.channels.cache.filter((channel) => channel.type === "GUILD_STORE").size + "**", inline: true },
				{ name: "Created At", value: time(guild?.createdAt), inline: true },
				{ name: "Roles", value: String(guild?.roles.cache.size), inline: true },
				{ name: "Emotes", value: "Count: **" + guild?.emojis.cache.size +
                    "**\nSee them with `" + (this.handler.prefix as PrefixSupplier)(message) + "emotecount`", inline: true },
			],
		})
			.addField("Features", guild?.features.length
				? guild?.features.map(f => guildFeatures[f] || f).sort().join("\n")
				: "None", false);

		return message.channel.send({ embeds: [emb.withOkColor(message)] });
	}
}
