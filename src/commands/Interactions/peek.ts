import { Message } from "discord.js";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

import getKawaiiResponseEmbed from "../../lib/APIs/KawaiiAPI";

export default class Peek extends KaikiCommand {
    constructor() {
        super("peek", {
            aliases: ["peek"],
            description: "Peek around the corner",
            usage: [""],
            typing: true,
        });
    }

    public async exec(message: Message): Promise<Message | void> {

        const embed = await getKawaiiResponseEmbed(message, "peek");

        if (embed) return message.channel.send({ embeds: [embed] });
    }
}