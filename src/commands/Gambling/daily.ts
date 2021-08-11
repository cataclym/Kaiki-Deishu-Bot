import { Message, MessageEmbed } from "discord.js";
import { KaikiCommand } from "kaiki";
import { MongoMoney } from "../../lib/money/MongoMoneyService";
import { IMoneyService } from "../../lib/money/IMoneyService";
import { dailyClaimsCache } from "../../cache/cache";
import { getBotDocument } from "../../struct/documentMethods";
import { botModel } from "../../struct/models";
import { errorMessage } from "../../lib/Embeds";

export default class ClaimDailyCommand extends KaikiCommand {
	private readonly _money: IMoneyService;
	constructor() {
		super("daily", {
			aliases: ["daily"],
			description: "Claim your daily currency allowance",
			usage: "",
		});
		this._money = MongoMoney;
	}

	public async exec(message: Message): Promise<Message> {

		const doc = await getBotDocument();
		const isEnabled = doc.settings.dailyEnabled;

		if (!isEnabled) return message.channel.send({ embeds: [await errorMessage(message, "A daily amount has not been set by the bot owner!")] });

		const amount = doc.settings.dailyAmount;

		if (!dailyClaimsCache[message.author.id]) {

			dailyClaimsCache[message.author.id] = true;
			await this._money.Add(message.author.id, amount);

			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription(`**${message.author.tag}**, You've just claimed your daily allowance! ${amount} ${this._money.currencyName} ${this._money.currencySymbol}`)
					.withOkColor(message),
				],
			});
		}

		else {
			return message.channel.send({
				embeds: [new MessageEmbed()
					.setDescription(`**${message.author.tag}**, You've already claimed your daily allowance!!`)
					.withErrorColor(message),
				],
			});
		}
	}
}
