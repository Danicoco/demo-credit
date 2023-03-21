import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('ledgers', (table) => {
        table.string('source').nullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('ledgers', (table) => {
        table.dropColumn('source');
    })
}
