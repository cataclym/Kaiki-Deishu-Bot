import { ActivityType, ColorResolvable, GuildMember, HexColorString, Message } from "discord.js";
import fetch from "node-fetch";
import Constants from "../struct/Constants";
import { KaikiColor } from "./Types/KaikiColor";
import { RegexpType } from "./Types/Miscellaneous";

export default class KaikiUtil {
    static toggledTernary(value: boolean) {
        return value
            ? "Enabled"
            : "Disabled";
    }

    // Returns message member's displaycolor if it exists, otherwise black.
    static async getMemberColorAsync(message: Message): Promise<ColorResolvable> {
        return <ColorResolvable>message?.member?.displayColor || "#000000";
    }

    static timeToMidnight(): number {
        const d = new Date();
        return (-d + d.setHours(Constants.MAGIC_NUMBERS.LIB.UTILITY.HRS_DAY, 0, 0, 0));
    }

    static trim(str: string, max: number): string {
        return (str.length > max) ? `${str.slice(0, max - 3)}...` : str;
    }

    /**
     * Create codeblocks ready to be sent to discord.
     * @param language
     | "ansi"
     | "asciidoc"
     | "autohotkey"
     | "bash"
     | "coffeescript"
     | "cpp"
     | "cs"
     | "css"
     | "diff"
     | "fix"
     | "glsl"
     | "ini"
     | "json"
     | "md"
     | "ml"
     | "prolog"
     | "py"
     | "tex"
     | "xl"
     | "xml"
     * @param code
     string
     */
    static async codeblock(
        code: string,
        language?:
            | "ansi"
            | "asciidoc"
            | "autohotkey"
            | "bash"
            | "coffeescript"
            | "cpp"
            | "cs"
            | "css"
            | "diff"
            | "fix"
            | "glsl"
            | "ini"
            | "json"
            | "md"
            | "ml"
            | "prolog"
            | "py"
            | "sql"
            | "tex"
            | "xl"
            | "xml",
    ): Promise<string> {
        return `\`\`\`${language ?? ""}\n${code}\`\`\``;
    }

    // Credit to https://futurestud.io/tutorials/split-an-array-into-smaller-array-chunks-in-javascript-and-node-js
    /**
     * Split the `items` array into multiple, smaller arrays of the given `size`.
     *
     * @param {Array} items
     * @param {Number} size
     *
     * @returns {Array[]}
     */
    static async chunk(items: any[], size: number): Promise<any[]> {
        const chunks = [];
        items = [].concat(...items);

        while (items.length) {
            chunks.push(
                items.splice(0, size),
            );
        }

        return chunks;
    }

    // Credits to https://www.codegrepper.com/code-examples/javascript/nodejs+strip+html+from+string
    static stripHtml(html: string) {
        return html.replace(/(<([^>]+)>)/ig, "");
    }

    // Credits: parktomatomi
    // https://stackoverflow.com/a/64093016
    static partition(array: any[], predicate: (...args: any) => boolean) {
        return array.reduce((acc, item) => (acc[+!predicate(item)].push(item), acc), [[], []]);
    }

    static async loadImage(url: string) {
        return fetch(url)
            .then(res => res.buffer());
    }

    // Credits to https://www.html-code-generator.com/javascript/color-converter-script
    static convertHexToRGB(hex: string): KaikiColor {
        hex = hex.replace(/#/g, "");

        const arrBuff = new ArrayBuffer(4);
        const vw = new DataView(arrBuff);
        vw.setUint32(0, parseInt(hex, 16), false);
        const arrByte = new Uint8Array(arrBuff);

        return { r: arrByte[1], g: arrByte[2], b: arrByte[3] };
    }

    static convertRGBToHex({ r, g, b }: KaikiColor): HexColorString {
        return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1)}`;
    }

    static getMemberPresence(obj: GuildMember) {
        const activities = obj.presence?.activities.map(psnc => {
            const { name, type, state, emoji, assets } = psnc;
            return { name, type, state, emoji, assets };
        });

        if (!activities) {
            return null;
        }

        const presence = activities.find(psnc => psnc.assets)
            || activities.find(psnc => psnc.type !== ActivityType.Custom)
            || activities.shift();

        if (!presence) {
            return null;
        }

        const type = ActivityType[presence.type];

        const image = presence.assets?.largeImageURL() || presence.assets?.smallImageURL();

        return {
            name: presence.name,
            state: presence.state,
            type,
            emoji: presence.emoji?.url,
            value: {
                large: presence.assets?.largeText,
                small: presence.assets?.smallText,
                details: presence.assets?.activity.details,
            },
            image: image,
        };
    }

    static isRegex(value: unknown): value is RegexpType {
        return (value as RegexpType).match !== undefined;
    }

    public static async handleToJSON(data: any) {
        if (data) return data;
        throw new Error("No data was found");
    }

    public static hasKey<O extends object>(obj: O, key: PropertyKey): key is keyof O {
        return key in obj;
    }

    static genericArrayFilter<T>(x: T | undefined): x is T {
        return !!x;
    }
}