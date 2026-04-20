import { EmbedBuilder, Guild, type Embed } from "discord.js";
import type { Player } from "../types/player.js";

const nameCache = new Map<string, string>();

async function getPlayerName(userId: string, guild: Guild): Promise<string> {
    const cacheResult = nameCache.get(userId);
    console.log(cacheResult);
    if (cacheResult) return cacheResult;

    try {
        const member = await guild.members.fetch(userId);
        if (member) {
            nameCache.set(userId, member.nickname ?? member.displayName);
            return member.nickname ?? member.displayName;
        } else {
            throw new Error("No member found!");
        }
    } catch {
        return `Unknown Player (${userId})`;
    }
}

export async function getLeaderboardEmbed(
    players: Player[],
    guild: Guild,
): Promise<EmbedBuilder> {
    const sortedPlayers = players.toSorted(
        (a, b) =>
            b.wins - a.wins ||
            a.totalPlays - b.totalPlays ||
            b.winsEvil - a.winsEvil ||
            b.demonWins - a.demonWins,
    );

    const embed = new EmbedBuilder()
        .setTitle("Leaderboard")
        .setColor(0x00ff00)
        .setTimestamp();

    if (sortedPlayers.length <= 0) {
        embed.setDescription("No games have been recorded yet!");
        return embed;
    }

    for (let i = 0; i < sortedPlayers.length; i++) {
        const currentPlayer = sortedPlayers[i];
        if (!currentPlayer) {
            continue;
        }

        let name = await getPlayerName(currentPlayer.userId, guild);

        const winRate =
            currentPlayer.totalPlays > 0
                ? (
                      (currentPlayer.wins / currentPlayer.totalPlays) *
                      100
                  ).toFixed(1)
                : "0.0";

        let medal = "";
        if (i === 0) medal = "🥇";
        else if (i === 1) medal = "🥈";
        else if (i === 2) medal = "🥉";

        embed.addFields({
            name: `${name} ${medal}`,
            value: `Played: ${currentPlayer.totalPlays} | Wins: ${currentPlayer.wins} | Evil: ${currentPlayer.winsEvil} | Demon: ${currentPlayer.demonWins} | Win%: ${winRate}%`,
            inline: false,
        });
    }
    return embed;
}
