const Discord = require("discord.js");
const { prefix } = require("../config.js");
const { version } = require("../package.json");

module.exports = {
	name: "help",
	args: false,
	aliases: ["h",],
	description: "Shows command info",
	async execute(message, args) {
		
		if (args[0]) {
			
			const data = [];
			const { commands } = message.client;
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
			
			if (!command) return message.channel.send(`Type \`${prefix}cmds\` to see a list of all the commands.`);

			else {
				data.push(`**Name:** ${command.name}`);
				if (command.description) data.push(`Description: ${command.description}`);
				if (command.usage) data.push(`Usage: \`${prefix}${command.name} ${command.usage}\``);
				if (command.aliases) data.push(`Aliases: ${command.aliases.join(", ")}`);
				return message.channel.send(data, {split: true});
			}
		}
		
		const color = message.member.displayColor;
		const AvUrl = await message.client.users.fetch("140788173885276160");

		const embed = new Discord.MessageEmbed({
			title: `${message.client.user.username} help page`,
			description: `Prefix is currently set to \`${prefix}\``,
			fields: [
				{ name: "📋 Commandlist", value: `For a complete list of commands and aliases type \`${prefix}Cmdlist\``, inline: true, },
				{ name: "🔍 Command Info", value: `Use \`${prefix}help [command]\` to get more help! Example: \`${prefix}help ping\``, inline: true, }
			],
			author: {
				name: `Nadeko Sengoku Bot v${version}`,
				url: "https://github.com/cataclym/nadekosengokubot",
				icon_url: message.author.displayAvatarURL(),
			},
			color,
			footer: {
				text: "Made by Cata <3", 
				icon_url: AvUrl.displayAvatarURL(),
			},
		});
		message.channel.send(embed);
	},
};