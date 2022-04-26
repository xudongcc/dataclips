import { Migration } from '@mikro-orm/migrations';

export class Migration20220426055810 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "clip" add column "last_edit_at" timestamptz(0) null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "clip" drop column "last_edit_at";');
  }

}
