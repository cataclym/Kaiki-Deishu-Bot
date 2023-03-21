import { ApplyOptions } from "@sapphire/decorators";
import { Args } from "@sapphire/framework";
import { Message } from "discord.js";
import { KaikiCommandOptions } from "../../lib/Interfaces/KaikiCommandOptions";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";

@ApplyOptions<KaikiCommandOptions>({
    name: "lick",
    description: "Lick someone... I guess...?",
    usage: ["", "@dreb"],
    typing: true,
})
export default class Lick extends KaikiCommand {
    public async messageRun(message: Message, args: Args): Promise<void | Message> {

        return this.client.imageAPIs.KawaiiAPI.sendImageAPIRequest(message, "lick", await args.rest("member").catch(() => null));
    }
}
