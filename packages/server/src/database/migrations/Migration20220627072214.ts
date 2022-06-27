/* eslint-disable */

import { Migration } from "@mikro-orm/migrations";

export class Migration20220627072214 extends Migration {
  async up(): Promise<void> {
    this.addSql(/* SQL */ `
      alter table
        "source"
      alter column
        "password" type text using ("password" :: text);
    `);

    this.addSql(/* SQL */ `
      alter table
        "source"
      alter column
        "ssh_password" type text using ("ssh_password" :: text);
    `);
  }

  async down(): Promise<void> {
    this.addSql(/* SQL */ `
      alter table
        "source"
      alter column
        "password" type varchar(255) using ("password" :: varchar(255));
    `);

    this.addSql(/* SQL */ `
      alter table
        "source"
      alter column
        "ssh_password" type varchar(255) using ("ssh_password" :: varchar(255));
    `);
  }
}
