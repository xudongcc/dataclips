import { Migration } from '@mikro-orm/migrations';

export class Migration20220425030203 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "clip" alter column "sql" type text using ("sql"::text);');
  }

  async down(): Promise<void> {
    this.addSql('alter table "clip" alter column "sql" type varchar(255) using ("sql"::varchar(255));');
  }

}
