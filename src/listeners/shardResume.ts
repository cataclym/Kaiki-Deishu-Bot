import { ApplyOptions } from "@sapphire/decorators";
import { Listener, ListenerOptions } from "@sapphire/framework";
import chalk from "chalk";
import logger from "loglevel";
import type KaikiSapphireClient from "../lib/Kaiki/KaikiSapphireClient";

@ApplyOptions<ListenerOptions>({
    event: "shardResume",
})
export default class ShardResume extends Listener {

    // Emitted when a shard resumes successfully.
    public async run(id: number, replayedEvents: number): Promise<void> {

        logger.info(`shardResume | Shard: ${chalk.green(id)} \nReplayed ${chalk.green(replayedEvents)} events.`);

        await (this.container.client as KaikiSapphireClient<true>).setPresence();
    }
}
