import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('ledgerTracker', (table) => {
        table.uuid('id', { primaryKey: true }).notNullable()
        // table.foreign('customerId').references("customers.id")
        // table.foreign('transactionId').references("transactions.id")
        table.enum('type', ["credit", "debit"]).notNullable().defaultTo("credit")
        table.enum('status', ["success", "pending", "failed"]).notNullable().defaultTo("pending")
        table.uuid('customerId').notNullable()
        table.uuid('transactionId').notNullable()
        table.timestamps(true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('ledgerTracker');
}

