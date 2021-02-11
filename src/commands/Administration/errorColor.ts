import { Argument, Command } from "@cataclym/discord-akairo";
import { Guild, Message, MessageEmbed } from "discord.js";
import { noArgGeneric } from "../../nsb/Embeds.js";
import { hexColorTable } from "../../nsb/Color.js";
import { customClient } from "../../struct/client.js";

export default class ErroColorConfigCommand extends Command {
	constructor() {
		super("config-errorcolor", {
			userPermissions: "ADMINISTRATOR",
			channel: "guild",
			args: [
				{
					id: "value",
					type: Argument.union("color", (m: Message, content: string) => hexColorTable[content]),
					otherwise: (m: Message) => noArgGeneric(m),
				},
			],
		});
	}
	public async exec(message: Message, { value }: { value: string }): Promise<Message> {

		await (message.client as customClient).addons.set((message.guild as Guild).id, "errorColor", value);

		return message.channel.send(new MessageEmbed({
			title: "Success!",
			description: `errorColor has been set to \`${value}\` !`,
			color: await message.getMemberColorAsync(),
		}));
	}

}
