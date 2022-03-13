import { sendPaginatedMessage } from "discord-js-button-pagination-ts";
import { PrefixSupplier } from "discord-akairo";
import { Snowflake } from "discord-api-types";
import { Message, MessageEmbed } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";

import { getGuildDocument } from "../../struct/documentMethods";

export default class RemoveEmoteReactCommand extends KaikiCommand {
    constructor() {
        super("listreacts", {
            aliases: ["listreacts", "ler"],
            channel: "guild",
            description: "List emotereact triggers.",
            usage: [""],
        });
    }

    public async exec(message: Message<true>): Promise<Message> {

        const db = await this.client.orm.emojiReactions.findMany({ where: { GuildId: BigInt(message.guildId) } }),
            pages: MessageEmbed[] = [];

        if (!db.length) {
            return message.channel.send({
                embeds: [new MessageEmbed()
                    .setTitle("No triggers")
                    .setDescription(`Add triggers with ${(this.handler.prefix as PrefixSupplier)(message)}aer`)
                    .withErrorColor(message)],
            });
        }

        for (let index = 15, p = 0; p < db.length; index += 15, p += 15) {

            pages.push(new MessageEmbed()
                .setTitle("Emoji triggers")
                .setDescription(db.slice(p, index).map(table => {
                    return `**${table.TriggerString}** => ${message.guild?.emojis.cache.get(String(table.EmojiId)) ?? table.EmojiId}`;
                }).join("\n"))
                .withOkColor(message));
        }

        return sendPaginatedMessage(message, pages, {});
    }
}
