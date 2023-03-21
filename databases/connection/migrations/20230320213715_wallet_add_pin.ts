import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('wallets', (table) => {
        table.string('pin').nullable();
        table.dateTime('pinChangedAt').defaultTo(knex.fn.now());
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('wallets', (table) => {
        table.dropColumn('pin');
        table.dropColumn('pinChangedAt');
    })
}
