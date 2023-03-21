import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('wallets', (table) => {
        table.increments('id', { primaryKey: true });
        table.string('accountName').notNullable()
        table.string('accountNumber').notNullable()
        table.float('balance').notNullable().defaultTo(0.0)
        table.dateTime('lastBalanceUpdateAt').notNullable()
        table.dateTime('lastLedgerBalanceUpdateAt').notNullable()
        table.float('ledgerBalance').notNullable().defaultTo(0.0)
        table.integer('customerId').unsigned().references('id').inTable('customers');
        table.timestamp("createdAt").defaultTo(knex.fn.now());
        table.timestamp("updatedAt").defaultTo(knex.fn.now());
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('wallets');
}
