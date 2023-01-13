import { knex} from "knex";

import config from './connection/config';
import { catchError } from "../src/modules/common/utils";

const { NODE_ENV = 'development' } = process.env;

if (typeof NODE_ENV !== "string") {
    throw catchError('Add NODE_ENV to .env');
}

const dbConfig = config[NODE_ENV];

const db = knex(dbConfig);

export default db;
