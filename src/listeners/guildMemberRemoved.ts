import { Listener } from "@cataclym/discord-akairo";
import { GuildMember } from "discord.js";
import { getGuildDB } from "../struct/db";

export default class GuildMemberRemovedListener extends Listener {
	constructor() {
		super("guildMemberRemove", {
			event: "guildMemberRemove",
			emitter: "client",
		});
	}
	public async exec(member: GuildMember): Promise<void> {

		const db = (await getGuildDB(member.guild.id));
		db.leaveRoles[member.id] = member.roles.cache.map(role => role.id);
		db.markModified("leaveRoles");
		db.save();
	}
}