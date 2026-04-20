import mysql from "mysql2/promise";
import env from "./env.js";

export const connection = await mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USER,
    database: env.DB,
    password: env.DB_PASS,
});
