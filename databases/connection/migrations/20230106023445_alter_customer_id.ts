import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('customers', (table) => {
        table.increments('id', { primaryKey: true,  }).alter();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('customers', (table) => {
        table.dropColumn('id')
    })
}
