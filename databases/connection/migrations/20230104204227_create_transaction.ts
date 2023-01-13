import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transactions', (table) => {
        table.uuid('id', { primaryKey: true }).notNullable()
        table.string('description')
        table.string('reference').notNullable().unique()
        // table.foreign('walletId').references("wallets.id")
        // table.foreign('customerId').references("customers.id")
        table.float('amount').notNullable().defaultTo(0.0)
        table.float('currentBalance').notNullable().defaultTo(0.0)
        table.float('currentLedgerBalance').notNullable().defaultTo(0.0)
        table.enum('type', ["credit", "debit"]).notNullable().defaultTo("credit")
        table.enum('status', ["success", "pending", "failed"]).notNullable().defaultTo("pending")
        table.uuid('customerId').notNullable()
        table.uuid('walletId').notNullable()
        table.timestamps(true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('transactions');
}

