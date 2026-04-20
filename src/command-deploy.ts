import { REST, Routes } from "discord.js";
import env from "./env.js";
import { commands } from "./commands/index.js";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(env.TOKEN);

type DeployCommandsProps = {
    guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
    try {
        await rest.put(
            Routes.applicationGuildCommands(env.CLIENT_ID, guildId),
            {
                body: commandsData,
            },
        );

        console.log("Successfully reloaded application commands.");
    } catch (error) {
        console.error(error);
    }
}
