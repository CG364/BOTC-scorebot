import {
    ChatInputCommandInteraction,
    CommandInteraction,
    SlashCommandBuilder,
} from "discord.js";

import { LeaderboardRepository } from "../repositories/leaderboardRepository.js";
const leaderboard = new LeaderboardRepository();

export const data = new SlashCommandBuilder()
    .setName("results")
    .setDescription("Record new game results")
    .addStringOption((opt) =>
        opt
            .setName("winners")
            .setDescription("Mention the winners, seperated by a space")
            .setRequired(true),
    )
    .addStringOption((opt) =>
        opt
            .setName("losers")
            .setDescription("Mention the losers, seperated by a space")
            .setRequired(true),
    )
    .addStringOption((option) =>
        option
            .setName("winning_team")
            .setDescription("Did good or evil win?")
            .setRequired(true)
            .addChoices(
                { name: "Good", value: "good" },
                { name: "Evil", value: "evil" },
            ),
    )
    .addStringOption((option) =>
        option
            .setName("demon")
            .setDescription("Mention the demon (only if evil wins)")
            .setRequired(false),
    );

function getUserIdsFromCommandOption(
    interaction: ChatInputCommandInteraction,
    key: string,
) {
    const value = interaction.options.getString(key);
    if (!value) {
        return [];
    }
    const results = value.match(/<@!?(\d+)>/g);
    return results ?? [];
}

async function getOrCreatePlayer(userId: string) {
    let player = await leaderboard.getPlayer(userId);
    if (!player) {
        player = {
            userId: userId,
            wins: 0,
            winsEvil: 0,
            totalPlays: 0,
            demonWins: 0,
        };
        await leaderboard.createPlayer(player);
    }
    return player;
}

export async function execute(interaction: CommandInteraction) {
    if (!interaction.isChatInputCommand()) return;

    const winners = getUserIdsFromCommandOption(interaction, "winners");
    const losers = getUserIdsFromCommandOption(interaction, "losers");
    const demon = getUserIdsFromCommandOption(interaction, "demon")[0] ?? null;
    const winningTeam = interaction.options
        .getString("winning_team", true)
        .toLowerCase();

    await Promise.all(
        winners.map(async (winner) => {
            const winnerId = winner.replace(/\D/g, "");
            let playerData = await getOrCreatePlayer(winnerId);
            playerData.totalPlays++;
            playerData.wins++;
            if (winningTeam == "evil") {
                playerData.winsEvil++;
                if (demon == winnerId) {
                    playerData.demonWins++;
                }
            }
            await leaderboard.updatePlayer(playerData);
        }),
    );

    await Promise.all(
        losers.map(async (loser) => {
            const loserId = loser.replace(/\D/g, "");
            let playerData = await getOrCreatePlayer(loserId);
            playerData.totalPlays++;
            await leaderboard.updatePlayer(playerData);
        }),
    );
}
