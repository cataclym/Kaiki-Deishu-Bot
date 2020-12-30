import { poems } from "../util/poems";
import { MessageEmbed, Message, User } from "discord.js";
import { errorColor } from "./Util";
import db from "quick.db";
import { Command, PrefixSupplier } from "@cataclym/discord-akairo";
const Tinder = new db.table("Tinder");
const tinderSlogan = ["Match?", "Chat?", "Date?", "Flirt?", "Text?", "Tease?", "Chat up?", "Take a risk?"];
// Some cringe anime wedding pictures
const weddingImageArray = ["https://media.discordapp.net/attachments/717045059215687691/754790776893997134/L4jgWKm.jpg", "https://media.discordapp.net/attachments/717045059215687691/754790949216845824/714738.jpg", "https://media.discordapp.net/attachments/717045059215687691/754791292646457474/408146.jpg",
	"https://media.discordapp.net/attachments/717045059215687691/754791432610644008/Anime-Wedding-runochan97-33554809-1280-720.jpg", "https://media.discordapp.net/attachments/717045059215687691/754791553075249252/Anime-Wedding-runochan97-33554796-800-600.jpg",
	"https://media.discordapp.net/attachments/717045059215687691/754791700492320798/4525190-short-hair-long-hair-brunette-anime-anime-girls-love-live-love-live-sunshine-wedding-dress-b.jpg"];
// TODO: Create a working role thingy...
// const characterRoles = ["Izuko Gaen", "Yozuru Kagenui", "Yotsugi Ononoki", "Ougi Oshino", "Senjougahara Hitagi", "Shinobu Oshino", "Nadeko Sengoku", "Mayoi Hachikuji",
// 	"Hanekawa Tsubasa", "Sodachi Oikura", "‌‌Tsukihi Araragi", "Karen Araragi", "Suruga Kanbaru", "Meme Oshino", "Rouka Numachi", "Kaiki Deishu",
// 	"‌‌Tooe Gaen", "Kiss-Shot Acerola-Orion Heart-Under-Blade", "Seiu Higasa"];
const TinderHelp = (msg: Message, cmd: Command): MessageEmbed => new MessageEmbed()
	.setTitle("Tinder help page")
	.addFields(
		{ name: "Rolls and likes", value: "Using the main command (`" + (cmd.handler.prefix as PrefixSupplier)(msg) + "tinder`), costs a roll!\n" +
				"If you decide to react with a 💚, you spend 1 like.\n" +
				"If you react with a 🌟, you spend all your rolls and likes.", inline: true },
		{ name: "How to marry", value: "You can only marry someone you are dating.\nMarrying is simple, type\n`" + (cmd.handler.prefix as PrefixSupplier)(msg) + "tinder marry @someone`\nThey will have to react with a ❤️, to complete the process!", inline: true },
		{ name: "Check status", value: "You can check who you have liked, disliked and who you are currently dating as well as who you have married.\n`" + (cmd.handler.prefix as PrefixSupplier)(msg) + "tinder list` / `" + (cmd.handler.prefix as PrefixSupplier)(msg) + "tinder list dislikes`", inline: true },
		{ name: "Dislikes", value: "You have unlimited dislikes. You can never draw someone you have disliked.", inline: false },
		{ name: "Manage your list", value: "You can remove dislikes/likes/dates and even divorce with\n`" + (cmd.handler.prefix as PrefixSupplier)(msg) + "tinder remove dislikes (user_list_nr)`. Obtain their number through the list.", inline: false },
	)
	.setColor("#31e387");

async function DMEMarry(): Promise<MessageEmbed> {
	const randomWeddingImage = weddingImageArray[Math.floor(Math.random() * weddingImageArray.length)];
	const randomPoem = poems[Math.floor(Math.random() * poems.length)];

	return new MessageEmbed()
		.setTitle("The wedding ceremony has begun!")
		.setColor("#e746da")
		.setURL(randomWeddingImage)
		.setImage(randomWeddingImage)
		.setDescription(randomPoem);
}
async function tinderRollEmbed(message: Message, randomUsr: User, RollsLikes?: string): Promise<MessageEmbed> {
	const waifuIDs = Tinder.get(`married.${randomUsr.id}`)?.length,
		likeIDs = Tinder.get("likeID");
	const likeIDValues = Object.values(likeIDs),
		flattArray = <string[]> likeIDValues.reduce((a: string, b: string) => a.concat(b), []),
		finalNumber = flattArray.filter((id: string) => id === randomUsr.id).length,
		member = message.guild?.members.cache.get(randomUsr.id);

	return new MessageEmbed()
		.setColor(await message.getMemberColorAsync())
		.setAuthor(tinderSlogan[Math.floor(Math.random() * tinderSlogan.length)])
		.setTitle(randomUsr.username)
		.setDescription(member ? "**Nickname**\n" + member?.displayName : "🌐")
		.addFields(
			{ name: "**Likes**", value: finalNumber > 1 ? finalNumber - 1 : "None", inline: true },
			{ name: "**Waifus**", value: waifuIDs > 1 ? waifuIDs - 1 : "None", inline: true },
			// In order to negate the user itself in the list
		)
		.setFooter(RollsLikes ? "React '❌' to dislike. '💚' To like. '🌟' To super like.\n" + RollsLikes : randomUsr.tag)
		.setImage(randomUsr.displayAvatarURL({ dynamic: true, size: 128 }));
}

const noArgRole = new MessageEmbed({
	color: errorColor,
	description: "Can't find this role. Make sure you inputted it correctly.",
});

const noArgGeneric = (message: Message): MessageEmbed => {
	const cmd = message.util?.parsed?.command;
	const prefix = (cmd?.handler.prefix as PrefixSupplier)(message);

	let usage = cmd?.description.usage;

	if (usage) {
		if (Array.isArray(usage)) {
			usage = usage.map(u => `${prefix}${cmd?.id} ${u}`).join("\n");
		}
		else {
			usage = `${prefix}${cmd?.id} ${usage}`;
		}
	}

	return new MessageEmbed({
		color: errorColor,
		description: "Please provide arguments.",
		fields: [{ name: "Usage", value: (usage ? `${usage}` : "<any>") }],
	});
};

const errorMessage = async (msg: string): Promise<MessageEmbed> => new MessageEmbed({
	title: "Error",
	description: msg,
	color: errorColor,
});

export {
	DMEMarry, TinderHelp, tinderRollEmbed, noArgRole, noArgGeneric, errorMessage,
};