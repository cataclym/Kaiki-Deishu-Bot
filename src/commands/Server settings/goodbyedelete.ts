import { Guild, Message, MessageEmbed, Permissions } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";
import { getGuildDocument } from "../../struct/documentMethods";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class GoodbyeDeleteCommand extends KaikiCommand {
    constructor() {
        super("goodbyedelete", {
            aliases: ["goodbyedelete", "goodbyedel", "byedel"],
            userPermissions: Permissions.FLAGS.MANAGE_GUILD,
            channel: "guild",
            description: "Set the time, in seconds, it takes for goodbye messages to be deleted by the bot. Set to 0 to disable.",
            usage: ["10"],
            args: [{
                id: "time",
                type: "number",
                otherwise: (m) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
            }],
        });
    }

    public async exec(message: Message<true>, { time }: { time: number | null }): Promise<Message> {

        time = time || null;

        await this.client.orm.guilds.update({
            where: {
                Id: BigInt(message.guildId),
            },
            data: {
                ByeTimeout: time,
            },
        });

        return message.channel.send({
            embeds: [new MessageEmbed()
                .setDescription(time
                    ? `Goodbye messages will be deleted after ${time} seconds.`
                    : "Goodbye message will not be deleted.",
                )
                .withOkColor(message)],
        });
    }
}
