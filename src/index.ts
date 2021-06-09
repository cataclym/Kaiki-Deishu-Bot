import logger from "loglevel";
import { extensionHook } from "./Extensions/Discord";
import container from "./inversify.config";
import { Bot } from "./struct/bot";
import mongodb from "./struct/db";
import { TYPES } from "./struct/types";

logger.setLevel("INFO");
new mongodb().init();
extensionHook();

process.on("unhandledRejection", (reason: Error, promise) => {
	logger.warn("Unhandled Rejection at:", promise, "reason:", reason);
});

const bot = container.get<Bot>(TYPES.Bot);

bot.start().catch(e => logger.error(e));

console.log(bot.client.botSettingID);
