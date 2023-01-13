import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('customers', (table) => {
        table.uuid('id', { primaryKey: true,  }),
        table.string('state'),
        table.string('address'),
        table.string('lastName'),
        table.string('firstName'),
        table.string('city').nullable(),
        table.string('email').notNullable(),
        table.string('password').notNullable(),
        table.string('phoneNumber').notNullable().checkLength("=", 11),
        table.boolean('isActive').notNullable().defaultTo(true)
    })
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('customers');
}

