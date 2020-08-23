const Discord = require("discord.js");
const { ParseMemberObject } = require("../functions/functions");

module.exports = {
	name: "uinfo",
	cooldown: 5,
	aliases: ["user"],
	description: "Shows relevant user info",
	args: false,
	usage: "\u200B",
	cmdCategory: "WIP (Useless)",
	execute(message, args) {
		let member = Discord.GuildMember;
		if (!args[0]) { member = message.member; }
		else { ParseMemberObject(message, args) ? member = ParseMemberObject(message, args) : member = message.member; }
		const color = member.displayColor;
		const embed = new Discord.MessageEmbed()
			.setColor(color)
			.setDescription(member.displayName)
			.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
			.setTitle(member.user.tag)
			.addFields(
				{ name: "ID", value: member.user.id, inline: true },
				{ name: "Account date/Join date", value: member.user.createdAt.toDateString() + "\n" + member.joinedAt.toDateString(), inline: true },
				{ name: "Presence", value: (member.user?.presence?.activities?.length ? member.user?.presence?.activities.join(", ") : "N/A") + "\n" + (member.user.presence.status !== "offline" ? Object.entries(member.user.presence.clientStatus).join(", ") : "Offline"), inline: true },
				{ name: "Boosting?", value: member?.premiumSince ? member?.premiumSince.toDateString() : "No", inline: true },
				{ name: "Bot?", value: member.user.bot ? "Yes" : "No", inline: true },
			);
		message.channel.send(embed);
	},
};