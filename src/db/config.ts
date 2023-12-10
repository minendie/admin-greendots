import { DatabaseDialect } from '@adminjs/sql';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const databaseType = process.env.DATABASE_DIALECT as DatabaseDialect;

export const connectionOptions = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: parseInt(process.env.DATABASE_PORT),
  ssl:  {
      ca: fs.readFileSync(`${__dirname}/DigiCertGlobalRootG2.crt.pem`).toString(),
      rejectUnauthorized: false // trust the self-assigned cert
  },
  connectionLimit: 100000, // Set the connection pool size
};

// export const connectionOptions = {
//   connectionString: process.env.DATABASE_URL,
//   database: process.env.DATABASE_NAME,
//   ssl:  {
//     ca: fs.readFileSync(`${__dirname}/DigiCertGlobalRootG2.crt.pem`).toString(),
//     rejectUnauthorized: false // trust the self-assigned cert
//   },
//   connectionLimit: 100000, // Set the connection pool size
// };
