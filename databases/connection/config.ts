import { join } from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

const { DB_NAME, DB_USER, DB_PASSWORD, DB_CLIENT, DB_HOST, DB_PORT } = process.env;

export default {
  development: {
    client: 'mysql',
    connection: {
      host: DB_HOST,
      user: DB_USER,
      port: DB_PORT,
      database: DB_NAME,
      password: DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
    migragions: {
      directory: join(__dirname, '../migrations')
    }
  },

  staging: {
    client: DB_CLIENT,
    connection: {
      host: DB_HOST,
      user: DB_USER,
      port: DB_PORT,
      database: DB_NAME,
      password: DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
  },

  production: {
    client: DB_CLIENT,
    connection: {
      host: DB_HOST,
      user: DB_USER,
      port: DB_PORT,
      database: DB_NAME,
      password: DB_PASSWORD,
    },
    pool: {
      min: 2,
      max: 10,
    },
  },
};
