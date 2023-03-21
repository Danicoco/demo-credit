import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("customers", (table) => {
      table.increments('id', { primaryKey: true });
      table.string("state");
      table.string("address");
      table.string("lastName");
      table.string("firstName");
      table.string("city").nullable();
      table.string("email").notNullable();
      table.string("password").notNullable();
      table.string("phoneNumber").notNullable();
      table.boolean("isActive").notNullable().defaultTo(true);
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable("customers");
}
