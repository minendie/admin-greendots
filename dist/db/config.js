import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const databaseType = process.env.DATABASE_DIALECT;
export const connectionOptions = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: parseInt(process.env.DATABASE_PORT),
    ssl: {
        ca: fs.readFileSync(`${__dirname}/DigiCertGlobalRootG2.crt.pem`).toString(),
        rejectUnauthorized: false
    },
    connectionLimit: 100000,
};
