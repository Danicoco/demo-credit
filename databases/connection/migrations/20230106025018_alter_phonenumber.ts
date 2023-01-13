import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.alterTable('customers', (table) => {
        table.string('phoneNumber').alter();
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.alterTable('customers', (table) => {
        table.string('phoneNumber').notNullable().checkLength("=", 11).alter()
    })
}
