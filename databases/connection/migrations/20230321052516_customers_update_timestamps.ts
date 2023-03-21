import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema
    .alterTable("customers", (table) => {
      table.timestamp("created_at").defaultTo(knex.fn.now()).alter();
      table.timestamp("updated_at").defaultTo(knex.fn.now()).alter();
    })
    .then(() => {
      return knex.schema.table("customers", function (table) {
        table.renameColumn("created_at", "createdAt");
        table.renameColumn("updated_at", "updatedAt");
      });
    });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("customers", (table) => {
    table.renameColumn("createdAt", "created_at");
    table.renameColumn("updatedAt", "updated_at");
  });
}
