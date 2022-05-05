import { Command } from "discord-akairo";
import { Message, MessageEmbed } from "discord.js";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";
import Utility from "../lib/Utility";

export default class MissingPermissionsListener extends KaikiListener {
    constructor() {
        super("missingPermissions", {
            event: "missingPermissions",
            emitter: "commandHandler",
        });
    }

    // Emitted when a permissions check is failed.

    public async exec(message: Message, command: Command, type: string, missing: any): Promise<void> {

        await Utility.listenerLog(message, this, logger.info, command);

        let cmd = this.client.cache.cmdStatsCache.get(command.id);

        cmd
            ? this.client.cache.cmdStatsCache.set(command.id, cmd++)
            : this.client.cache.cmdStatsCache.set(command.id, 1);

        if (message.channel.type !== "DM") {
            await message.channel.send({
                embeds:
                    [new MessageEmbed({
                        title: "Missing permissions",
                        description: `${type === "client" ? "Client" : "User"} can't execute \`${command.id}\` due to missing permissions.`,
                        footer: { text: `Missing: ${missing}` },
                    })
                        .withErrorColor(message)],
            });
        }
    }
}
