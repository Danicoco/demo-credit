import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transactions', (table) => {
        table.increments('id', { primaryKey: true });
        table.string('description')
        table.string('reference').notNullable().unique()
        table.integer('walletId').unsigned().references('id').inTable('wallets');
        table.integer('customerId').unsigned().references('id').inTable('customers');
        table.float('amount').notNullable().defaultTo(0.0)
        table.float('currentBalance').notNullable().defaultTo(0.0)
        table.float('currentLedgerBalance').notNullable().defaultTo(0.0)
        table.enum('type', ["credit", "debit"]).notNullable().defaultTo("credit")
        table.enum('status', ["success", "pending", "failed"]).notNullable().defaultTo("pending")
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('transactions');
}
