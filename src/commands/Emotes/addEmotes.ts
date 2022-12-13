import { Message, PermissionsBitField } from "discord.js";
import sizeOf from "image-size";
import Emotes from "../../lib/Emotes";
import KaikiCommand from "../../lib/Kaiki/KaikiCommand";
import KaikiEmbeds from "../../lib/KaikiEmbeds";
import Constants from "../../struct/Constants";

const imgRegex = /(http(s?):)([/|.\w\s-])*\.(?:jpg|gif|png|jpeg)/gi;
// Credit to https://github.com/Snitt/emojibotten/blob/master/commands/management/emoji.js
export default class AddEmotesCommand extends KaikiCommand {
    constructor() {
        super("addemotes", {
            aliases: ["addemotes", "aes"],
            description: "Adds multiple emotes. Cannot specify names.",
            usage: "img-link1 img-link2 img-link3",
            clientPermissions: PermissionsBitField.Flags.ManageEmojisAndStickers,
            userPermissions: PermissionsBitField.Flags.ManageEmojisAndStickers,
            channel: "guild",
            args: [
                {
                    id: "urls",
                    type: imgRegex,
                    match: "separate",
                    otherwise: (msg: Message) => ({ embeds: [KaikiEmbeds.genericArgumentError(msg)] }),
                },
            ],
        });
    }

    public async exec(message: Message, {
        urls,
    }: { urls: RegExpMatchArray, names: string[] }): Promise<Message | void> {

        // TODO: Test args
        for (const url of urls) {
            const msNow = Date.now().toString();
            const file = Emotes.getFileOut(msNow);
            await Emotes.saveFile(url, file);

            const name = msNow.substring(7, 39);

            // Example output: { width: 240, height: 240, type: 'gif' }
            const imgDimensions = sizeOf(file);

            if ((imgDimensions.width && imgDimensions.height)
                && imgDimensions.width <= Constants.MAGIC_NUMBERS.CMDS.EMOTES.MAX_WIDTH_HEIGHT
                && imgDimensions.height <= Constants.MAGIC_NUMBERS.CMDS.EMOTES.MAX_WIDTH_HEIGHT) {
                await Emotes.saveEmoji(message, url, name);
            }
            else if (imgDimensions.type) {
                const img = await Emotes.resizeImage(file, imgDimensions.type, Constants.MAGIC_NUMBERS.CMDS.EMOTES.MAX_WIDTH_HEIGHT, message);
                await Emotes.saveEmoji(message, img, name);
            }
            await Emotes.deleteImage(file);
        }
    }
}

