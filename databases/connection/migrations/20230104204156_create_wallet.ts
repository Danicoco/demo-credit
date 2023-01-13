import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('wallets', (table) => {
        table.uuid('id', { primaryKey: true })
        table.string('accountName').notNullable()
        table.string('accountNumber').notNullable()
        table.float('balance').notNullable().defaultTo(0.0)
        table.dateTime('lastBalanceUpdateAt').notNullable()
        table.dateTime('lastLedgerBalanceUpdateAt').notNullable()
        table.float('ledgerBalance').notNullable().defaultTo(0.0)
        table.string('customerId')
        table.timestamps(true)
        // table.uuid('customerId').references('id').inTable('customers').notNullable()
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('wallets');
}

