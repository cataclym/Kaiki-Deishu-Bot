import { getCommandStatsDocument } from "../struct/documentMethods";

// Anime quotes
export type respType = { anime: string, character: string, quote: string };
export const animeQuoteCache: {[character: string]: respType } = {};

export let cmdStatsCache: {[index: string]: number} = {};

setInterval(async () => {
	const db = await getCommandStatsDocument();

	if (!Object.entries(cmdStatsCache).length) return;

	for await (const [id, number] of Object.entries(cmdStatsCache)) {
		db.count[id]
			? db.count[id] += number
			: db.count[id] = number;
	}
	db.markModified("count");
	await db.save();

	cmdStatsCache = {};
}, 900000);