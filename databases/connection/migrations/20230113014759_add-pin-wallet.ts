import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('customers', (table) => {
        table.string('pin').checkLength("=", 4).nullable();
        table.string('pinChangedAt').nullable();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('customers', (table) => {
        table.dropColumn('pin');
        table.dropColumn('pinChangedAt');
    })
}

