import "dotenv/config";
import { Client } from "discord.js";
import { deployCommands } from "./command-deploy.js";
import { commands } from "./commands/index.js";
import env from "./env.js";

const client = new Client({
    intents: ["Guilds", "GuildMessages"],
});

client.once("clientReady", () => {
    console.log("Bot started successfully.");
});

client.on("guildCreate", async (guild) => {
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }

    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands]
            .execute(interaction)
            .catch(console.error);
    }
});

client.login(env.TOKEN);
