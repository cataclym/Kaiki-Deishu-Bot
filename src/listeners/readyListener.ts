import chalk from "chalk";
import { ActivityType } from "discord.js";
import logger from "loglevel";
import KaikiListener from "../lib/Kaiki/KaikiListener";
import { Migrations } from "../lib/Migrations/Migrations";
import { excludeData } from "../lib/SlashCommands/data";
import Constants from "../struct/Constants";

export default class ReadyListener extends KaikiListener {
    constructor() {
        super("ready", {
            event: "ready",
            emitter: "client",
            type: "once",
        });
    }

    public async exec(): Promise<void> {

        new Migrations(this.client.connection(), this.client)
            .runAllMigrations()
            .then(async (res: number) => {
                if (res) {
                    logger.info(`
${(chalk.greenBright)("|----------------------------------------------------------|")}
migrationService | Migrations have successfully finished
migrationService | Inserted ${(chalk.green)(res)} records into kaikidb
${(chalk.greenBright)("|----------------------------------------------------------|")}`);
                    await this.client.botSettings.init();
                    await this.client.guildsDb.init();
                }
            })
            .catch(e => {
                throw e;
            });

        // Find all guilds that have dad-bot enabled
        const enabled = await this.client.orm.guilds.findMany({
            where: {
                DadBot: true,
            },
            select: {
                Id: true,
            },
        });

        // Create slash commands in those guilds
        enabled.forEach(g => {
            this.client.guilds.cache.get(String(g.Id))?.commands.create(excludeData)
                // Ignore the unhandled rejection
                .catch(() => null);
        });

        logger.info(`Created slash commands in ${chalk.green(enabled.length)} guilds.`);

        this.client.initializeServices()
            .then(() => logger.info("dailyResetTimer | Service initiated"));

        const db = await this.client.orm.botSettings.findFirst();

        if (db && db.Activity && db.ActivityType) {

            const acType = Constants.ActivityTypes[db.ActivityType];

            this.client.user?.setPresence({
                activities: [
                    {
                        name: db.Activity,
                        type: acType,
                    },
                ],
            });
        }
    }
}
