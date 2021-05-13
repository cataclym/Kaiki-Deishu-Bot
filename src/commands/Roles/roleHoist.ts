import { Command } from "@cataclym/discord-akairo";
import { Message, MessageEmbed, Role } from "discord.js";
import { noArgRole } from "../../lib/Embeds";

export default class RoleHoistCommand extends Command {
	constructor() {
		super("rolehoist", {
			aliases: ["rolehoist", "hoistrole", "hoist"],
			clientPermissions: "MANAGE_ROLES",
			userPermissions: "MANAGE_ROLES",
			description: { description: "Hoists or unhoists a role", usage: "@gamers" },
			channel: "guild",
			args: [
				{
					id: "role",
					type: "role",
					otherwise: (message: Message) => noArgRole(message),
				},
			],
		});
	}

	public async exec(message: Message, { role }: { role: Role}): Promise<Message> {

		if (role.hoist) {
			role.setHoist(false);
		}
		else {
			role.setHoist(true);
		}

		return message.channel.send(new MessageEmbed({
			description: `Toggled ${role.name}'s hoist status to ${!role.hoist}.`,
		})
			.withOkColor(message));

	}
}