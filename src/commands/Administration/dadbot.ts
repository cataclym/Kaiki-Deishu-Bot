import { Command, PrefixSupplier } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import db from "quick.db";
import { getMemberColorAsync } from "../../util/Util.js";
const guildConfig = new db.table("guildConfig");
import { updateVar } from "../../listeners/message";
import { noArgGeneric } from "../../util/embeds.js";

module.exports = class DadBotConfigCommand extends Command {
	constructor() {
		super("config-dadbot", {
			userPermissions: "ADMINISTRATOR",
			args: [
				{
					id: "value",
					index: 0,
					type: "string",
				},
			],

		});
	}
	public async exec(message: Message, { value }: { value: string}) {
		const enabledGuilds = guildConfig.get("dadbot");

		const embed = new MessageEmbed().setColor(await getMemberColorAsync(message));
		if (value) {
			switch (value) {
				case ("enable"):
				case ("true"): {
					if (!enabledGuilds.includes(message.guild?.id)) {
						await enabledGuilds.push(message.guild?.id);
						updateVar(enabledGuilds);
						guildConfig.set("dadbot", enabledGuilds);
						embed.setDescription(`DadBot functionality has been enabled in ${message.guild?.name}!\nIndividual users can still disable dadbot on themselves with ${(this.handler.prefix as PrefixSupplier)(message)}exclude.`);
						return message.util?.send(embed);
					}
					else {
						embed.setDescription("You have already enabled DadBot.");
						return message.util?.send(embed);
					}
				}
				case ("disable"):
				case ("false"): {
					if (enabledGuilds.includes(message.guild?.id)) {
						await enabledGuilds.splice(enabledGuilds.indexOf(message.guild?.id), 1);
						updateVar(enabledGuilds);
						guildConfig.set("dadbot", enabledGuilds);
						embed.setDescription(`DadBot functionality has been disabled in ${message.guild?.name}!`);
						return message.util?.send(embed);
					}
					else {
						embed.setDescription("You have already disabled DadBot.");
						return message.util?.send(embed);
					}
				}
			}
		}
		else {
			return message.channel.send(noArgGeneric(message));
		}
	}
};