import type { RowDataPacket } from "mysql2";
import { connection } from "../db.js";
import type { ILeaderboardRepository } from "../interfaces/ILeaderboardRepository.js";
import type { Player } from "../types/player.js";

interface sqlPlayer extends RowDataPacket {
    user_id: string;
    wins: number;
    wins_evil: number;
    total_plays: number;
}

export class LeaderboardRepository implements ILeaderboardRepository {
    async getPlayer(userId: string): Promise<Player | null> {
        const [results, fields] = await connection.execute<sqlPlayer[]>(
            "SELECT * FROM `leaderboard` WHERE user_id = ?",
            [userId],
        );

        if (!results[0]) {
            return null;
        }

        const result = results[0];

        return {
            userId: result.user_id,
            wins: result.wins,
            winsEvil: result.wins_evil,
            totalPlays: result.total_plays,
            demonWins: result.demon_wins,
        };
    }
    async getPlayers(): Promise<Player[]> {
        const [results, fields] = await connection.execute<sqlPlayer[]>(
            "SELECT * FROM `leaderboard`",
        );

        const players = [] as Player[];
        results.forEach((result) => {
            players.push({
                userId: result.user_id,
                wins: result.wins,
                winsEvil: result.wins_evil,
                totalPlays: result.total_plays,
                demonWins: result.demon_wins,
            });
        });

        return players;
    }

    async createPlayer(player: Player): Promise<void> {
        const [results, field] = await connection.execute(
            "INSERT INTO `leaderboard`(user_id, wins, wins_evil, total_plays, demon_wins) VALUES (?, ?, ?, ?, ?)",
            [
                player.userId,
                player.wins,
                player.winsEvil,
                player.totalPlays,
                player.demonWins,
            ],
        );
    }

    async updatePlayer(player: Player): Promise<void> {
        const playerResult = await this.getPlayer(player.userId);
        const [results, field] = await connection.execute(
            "UPDATE `leaderboard` SET wins = ?, wins_evil = ?, total_plays = ?, demon_wins = ? WHERE user_id = ?",
            [
                player.wins,
                player.winsEvil,
                player.totalPlays,
                player.demonWins,
                player.userId,
            ],
        );
    }
}
