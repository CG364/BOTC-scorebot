import z from "zod";

const schema = z.object({
    TOKEN: z.string(),
    CLIENT_ID: z.string(),
    GUILD_ID: z.string(),
    CHAMPION_ROLE_ID: z.string(),

    DB_USER: z.string(),
    DB_PASS: z.string(),
    DB: z.string(),
    DB_HOST: z.hostname(),
});

export default schema.parse(process.env);
