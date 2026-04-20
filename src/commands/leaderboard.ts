import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getLeaderboardEmbed } from "../views/leaderboardEmbed.js";
import { LeaderboardRepository } from "../repositories/leaderboardRepository.js";

const leaderboard = new LeaderboardRepository();

export const data = new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Show the leaderboard.");

export async function execute(interaction: CommandInteraction) {
    const players = await leaderboard.getPlayers();
    if (!interaction.guild) {
        return;
    }

    const embed = await getLeaderboardEmbed(players, interaction.guild);
    await interaction.reply({ embeds: [embed] });
}
