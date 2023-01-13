import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('ledgers', (table) => {
        // table.foreign('walletId').references("wallets.id")
        table.uuid('id', { primaryKey: true }).notNullable()
        // table.foreign('customerId').references("customers.id")
        table.float('amount').notNullable().defaultTo(0.0)
        table.enum('type', ["credit", "debit"]).notNullable().defaultTo("credit")
        table.uuid('walletId').notNullable()
        table.uuid('customerId').notNullable()
        table.timestamps(true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('ledgers');
}

