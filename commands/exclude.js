/* eslint-disable max-len */
const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "exclude",
	description: "Adds or removes excluded role from user.",
	aliases: ["e",],
	args: false,
	async execute(message) {
		const { names } = require("../config.js");
		const excludedRole = names.toString();
		const color = message.member.displayColor;
		// EMBEDS
		const embed1 = new MessageEmbed({
			title: "Error!",
			description: `\`${excludedRole}\` was not found in guild. Creating... `,
			color,
			footer: { text: "Beep boop." },
		});
		const embed2 = new MessageEmbed({
			title: "Success!",
			description: `Added role \`${excludedRole}\`.\nType the command again to remove.`,
			color,
		});
		const embed3 = new MessageEmbed({
			title: "Success!",
			description: `Removed role \`${excludedRole}\`.\nType the command again to add it back.`,
			color,
		});
		// END
		if (!message.guild.roles.cache.find((r) => r.name === excludedRole)) {
			message.guild.roles.create({
				data: { name: excludedRole },
				reason: "Role didn't exist yet",
			})
				.then(message.channel.send(embed1))
				.catch(console.error);
			setTimeout(() => { (message.member.roles.add(message.guild.roles.cache.find((r) => r.name === excludedRole))); }, 2000);
			setTimeout(() => { (message.channel.send(embed2)); }, 2000);
		} else if (!message.member.roles.cache.find((r) => r.name === excludedRole)) {
			message.member.roles.add(message.guild.roles.cache.find((r) => r.name === excludedRole));
			message.channel.send(embed2);
		} else if (message.member.roles.cache.find((r) => r.name === excludedRole)) {
			message.member.roles.remove(message.guild.roles.cache.find((r) => r.name === excludedRole));
			message.channel.send(embed3);
		}
	},
};
// We want to adapt it into the rewrite rjt did
// Not in use yet as it doesnt work perfectly
/*
module.exports = {
    name: 'exclude',
    description: 'Adds or removes excluded role from user.',
    async execute(message) {
    const specialString = require("../storage/names.json");
    let excludedRole = message.guild.roles.cache.find(r => r.name === specialString.name);

    if(!excludedRole)excludedRole = await message.guild.roles.create
    ({ data: { name: specialString.name }, reason: "Role didn't exist yet." })
    .catch(console.error);

    if(!message.member.roles.cache.has(excludedRole)) {
        message.member.roles.add(excludedRole);
        return message.channel.send(`Added role \`${specialString.name}\`.\nType the command again to add it back.`);
}
    if(message.member.roles.cache.has(excludedRole)) {
        message.member.roles.remove(excludedRole);
        return message.channel.send(`Removed role \`${specialString.name}\`.\nType the command again to add it back.`);
}
    },
};
*/
