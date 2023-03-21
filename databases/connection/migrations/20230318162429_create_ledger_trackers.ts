import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('ledgerTrackers', (table) => {
        table.increments('id', { primaryKey: true });
        table.enum('type', ["credit", "debit"]).notNullable().defaultTo("credit")
        table.enum('status', ["success", "pending", "failed"]).notNullable().defaultTo("pending")
        table.integer('walletId').unsigned().references('id').inTable('wallets');
        table.integer('transactionId').unsigned().references('id').inTable('transactions');
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('ledgerTrackers');
}
