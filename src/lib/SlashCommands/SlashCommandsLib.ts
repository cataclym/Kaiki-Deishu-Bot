import { AkairoMessage } from "discord-akairo";
import { ApplicationCommandDataResolvable, EmbedBuilder, Message } from "discord.js";
import KaikiAkairoClient from "../Kaiki/KaikiAkairoClient";
import KaikiEmbeds from "../KaikiEmbeds";

export default class SlashCommandsLib {

    static excludeData: ApplicationCommandDataResolvable = {
        name: "exclude",
        description: "Excludes you from being targeted by dad-bot. Execute command again to reverse this action.",
    };

    public static dadbotCheck(message: AkairoMessage | Message) {
        return !!message.guild?.isDadBotEnabled();
    }

    public static async getOrCreateDadbotRole(message: AkairoMessage<"cached"> | Message<true>, client: KaikiAkairoClient<true>) {
        const db = await client.db.getOrCreateGuild(message.guildId);
        return message.guild?.roles.cache.get(String(db.ExcludeRole));
    }

    public static async excludeCommand(message: Message<true>, client: KaikiAkairoClient<true>) {
        const embeds = [];
        let excludedRole = await SlashCommandsLib.getOrCreateDadbotRole(message, client);

        if (!excludedRole) {
            excludedRole = await message.guild?.roles.create({
                name: process.env.DADBOT_DEFAULT_ROLENAME,
                reason: "Initiate default dad-bot exclusion role.",
            });

            await message.client.db.orm.guilds.update({
                where: {
                    Id: BigInt(message.guildId),
                },
                data: {
                    ExcludeRole: BigInt(excludedRole?.id),
                },
            });

            await message.client.guildsDb.set(message.guildId, "ExcludeRole", excludedRole.id);

            embeds.push(new EmbedBuilder({
                title: "Creating dad-bot role!",
                description: "There doesn't seem to be a default dad-bot role in this server. Creating one...",
                footer: { text: "Beep boop..." },
            })
                .withErrorColor(message.guild));
        }

        if (!message.member?.hasExcludedRole()) {
            await message.member?.roles.add(excludedRole);
            embeds.push(KaikiEmbeds.addedRoleEmbed(excludedRole.name)
                .withOkColor(message.guild));
            return message.reply({ embeds: embeds });
        }

        else {
            await message.member.roles.remove(excludedRole);
            embeds.push(KaikiEmbeds.removedRoleEmbed(excludedRole.name)
                .withOkColor(message.guild));
            return message.reply({ embeds: embeds });
        }
    }

}

