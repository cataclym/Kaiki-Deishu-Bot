import { Snowflake } from "discord-api-types";
import { Guild, GuildMember, Message, MessageEmbed } from "discord.js";
import { getGuildDocument } from "../../struct/documentMethods";
import { KaikiCommand } from "../../lib/KaikiClass";

export default class RestoreUserRoles extends KaikiCommand {
	constructor() {
		super("restore", {
			aliases: ["restore"],
			userPermissions: ["ADMINISTRATOR", "MANAGE_ROLES"],
			description: "Restores roles for a user who has previously left the server.",
			usage: "@dreb",
			channel: "guild",
			args: [
				{
					id: "member",
					type: "member",
					prompt: {
						start: "Specify a member?",
						retry: "I-I-Invalid member! Try again.",
					},
				},
			],
		});
	}
	public async exec(message: Message, { member }: { member: GuildMember }): Promise<Message | void> {

		const guild = message.guild as Guild,
			db = await getGuildDocument(guild.id),
			leaveRoles = db.leaveRoles[member.id];

		if (leaveRoles.length) {

			const roleIDArray = leaveRoles.filter(roleString => guild.roles.cache.get(roleString as Snowflake));

			if (!roleIDArray.length) return;

			member.roles.add(roleIDArray as Snowflake[]);
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription(`Restored roles of ${member.user.tag}`)
					.withOkColor(message)],
			});
		}

		else {
			return message.channel.send({ embeds: [new MessageEmbed()
				.setDescription("This user's roles have not been saved, or user has never left the guild.")
				.withErrorColor(message)],
			});
		}
	}
}
