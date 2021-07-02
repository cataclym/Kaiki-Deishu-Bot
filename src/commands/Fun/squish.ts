import { GuildMember, Message, MessageEmbed, MessageAttachment } from "discord.js";
import { createCanvas, loadImage } from "canvas";
import { KaikiCommand } from "Kaiki";

export default class SquishCommand extends KaikiCommand {
	constructor() {
		super("squish", {
			aliases: ["squish"],
			description: "Squishes given member's avatar",
			usage: "@dreb",
			args: [
				{
					id: "member",
					type: "member",
					default: (message: Message) => message.member,
				},
			],
		});
	}
	public async exec(message: Message, { member }: { member: GuildMember}): Promise<Message> {

		const picture = createCanvas(64, 256);
		const squishImage = picture.getContext("2d");
		const avatar = await loadImage(member.user.displayAvatarURL({ dynamic: true, size: 256, format: "png" }));
		squishImage.drawImage(avatar, 0, 0, 64, 256);
		const attachment: MessageAttachment = new MessageAttachment(picture.toBuffer(), "Squished.jpg");
		const embed = new MessageEmbed({
			title: "Squished avatar...",
			image: { url: "attachment://Squished.jpg" },
			color: member.displayColor,
		});

		return message.channel.send({ files: [attachment], embeds: [embed] });
	}
}
