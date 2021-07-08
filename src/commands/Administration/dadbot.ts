import { PrefixSupplier } from "discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../lib/Embeds";
import { KaikiCommand } from "../../lib/KaikiClass";
import { getGuildDocument } from "../../struct/documentMethods";

export default class DadBotConfigCommand extends KaikiCommand {
	constructor() {
		super("config-dadbot", {
			userPermissions: "ADMINISTRATOR",
			channel: "guild",
			args: [
				{
					id: "value",
					type: ["enable", "true", "disable", "false"],
					otherwise: (message: Message) => noArgGeneric(message),
				},
			],

		});
	}
	public async exec(message: Message, { value }: { value: "enable" | "true" | "disable" | "false" }): Promise<Message> {
		const embed = new MessageEmbed().withOkColor(message),
			guildID = (message.guild as Guild).id,
			db = await getGuildDocument(guildID);

		let isEnabled = message.client.guildSettings.get(guildID, "dadBot", {
			enabled: false,
			excludedChannels: {},
		}).enabled;

		if (typeof db.settings["dadBot"] === "boolean") {
			const bool = db.settings["dadBot"];
			db.settings["dadBot"] = {
				enabled: bool,
				excludedChannels: {},
			};
			db.markModified("settings.dadBot");
			isEnabled = db.settings.dadBot.enabled;
		}

		switch (value) {
			case ("enable"):
			case ("true"): {
				if (!isEnabled) {
					db.settings.dadBot.enabled = true;
					db.markModified("settings.dadBot.enabled");
					await message.client.guildSettings.set(guildID, "dadBot", db.settings.dadBot);
					await db.save();

					return message.channel.send({ embeds: [embed
						.setTitle(`DadBot has been enabled in ${message.guild?.name}!`)
						.setDescription(`Individual users can still disable dadbot on themselves with \`${(this.handler.prefix as PrefixSupplier)(message)}exclude\`.`)],
					});
				}
				else {
					return message.channel.send({
						embeds: [embed
							.setTitle("Already enabled")
							.setDescription("You have already **enabled** DadBot in this server.")
							.withErrorColor(message)],
					});
				}
			}
			case ("disable"):
			case ("false"): {
				if (isEnabled) {
					db.settings.dadBot.enabled = false;
					db.markModified("settings.dadBot.enabled");
					await message.client.guildSettings.set(guildID, "dadBot", db.settings.dadBot);
					await db.save();

					return message.channel.send({ embeds: [embed
						.setTitle(`DadBot has been disabled in ${message.guild?.name}!`)] });
				}
				else {
					return message.channel.send({
						embeds: [embed
							.setTitle("Already disabled")
							.setDescription("You have already **disabled** DadBot in this server.")
							.withErrorColor(message)],
					});
				}
			}
		}
	}
}
