import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('customers', (table) => {
        table.timestamps(true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('customers', (table) => {
        table.dropTimestamps(true)
    })
}

