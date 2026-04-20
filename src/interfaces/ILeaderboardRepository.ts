import type { Player } from "../types/player.js";

export interface ILeaderboardRepository {
    getPlayer(userId: string): Promise<Player | null>;
    getPlayers(): Promise<Player[]>;

    createPlayer(player: Player): Promise<void>;
    updatePlayer(player: Player): Promise<void>;
}
