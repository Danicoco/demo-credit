import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('ledgers', (table) => {
        table.increments('id', { primaryKey: true });
        table.float('amount').notNullable().defaultTo(0.0)
        table.enum('type', ["credit", "debit"]).notNullable().defaultTo("credit")
        table.integer('walletId').unsigned().references('id').inTable('wallets');
        table.integer('customerId').unsigned().references('id').inTable('customers');
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('ledgers');
}
