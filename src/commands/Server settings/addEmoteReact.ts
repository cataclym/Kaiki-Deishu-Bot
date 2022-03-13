import { Guild, GuildEmoji, Message, MessageEmbed, Permissions } from "discord.js";
import KaikiCommand from "Kaiki/KaikiCommand";
import { getGuildDocument } from "../../struct/documentMethods";
import { emoteReactCache } from "../../cache/cache";
import { populateERCache } from "../../lib/functions";
import KaikiEmbeds from "../../lib/KaikiEmbeds";

export default class EmoteReactCommand extends KaikiCommand {
    constructor() {
        super("addemotereact", {
            aliases: ["addemotereact", "emotereact", "aer"],
            userPermissions: Permissions.FLAGS.MANAGE_EMOJIS_AND_STICKERS,
            clientPermissions: Permissions.FLAGS.ADD_REACTIONS,
            channel: "guild",
            description: "Add triggers for the bot to react with emojis/emotes to. Use quotes for triggers with spaces.",
            usage: ["red :red:", "anime :weeaboosgetout:"],
            args: [
                {
                    id: "trigger",
                    type: "string",
                    otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
                },
                {
                    id: "emoji",
                    type: "emoji",
                    otherwise: (m: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(m)] }),
                },
            ],
        });
    }

    public async exec(message: Message<true>, {
        trigger,
        emoji,
    }: { trigger: string, emoji: GuildEmoji }): Promise<Message> {

        trigger = trigger.toLowerCase();

        this.client.orm.emojiReactions.create({
            data: {
                Guilds: {
                    connectOrCreate: {
                        where: {
                            Id: BigInt(message.guildId),
                        },
                        create: {
                            Id: BigInt(message.guildId),
                            Prefix: process.env.PREFIX || ";",
                        },
                    },
                },
                EmojiId: BigInt(emoji.id),
                TriggerString: trigger,
            },
        });


        if (!this.client.cache.emoteReactCache.get(message.guildId)) await populateERCache(message);

        if (trigger.includes(" ")) {
            this.client.cache.emoteReactCache.get(message.guildId)?.get("has_space")?.set(trigger, emoji.id);
        }

        else {
            this.client.cache.emoteReactCache.get(message.guildId)?.get("no_space")?.set(trigger, emoji.id);
        }

        return message.channel.send({
            embeds: [new MessageEmbed()
                .setTitle("New emoji trigger added")
                .setDescription(`Typing \`${trigger}\` will force me to react with ${emoji}...`)
                .setThumbnail(emoji.url)
                .withOkColor(message)],
        });
    }
}
