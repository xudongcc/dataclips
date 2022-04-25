import { Migration } from '@mikro-orm/migrations';

export class Migration20220425085554 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "virtual_source_table" drop constraint "virtual_source_table_source_id_foreign";');
    this.addSql('alter table "virtual_source_table" drop constraint "virtual_source_table_clip_id_foreign";');

    this.addSql('alter table "virtual_source_table" add constraint "virtual_source_table_source_id_foreign" foreign key ("source_id") references "source" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "virtual_source_table" add constraint "virtual_source_table_clip_id_foreign" foreign key ("clip_id") references "clip" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "virtual_source_table" drop constraint "virtual_source_table_source_id_foreign";');
    this.addSql('alter table "virtual_source_table" drop constraint "virtual_source_table_clip_id_foreign";');

    this.addSql('alter table "virtual_source_table" add constraint "virtual_source_table_source_id_foreign" foreign key ("source_id") references "source" ("id") on update cascade;');
    this.addSql('alter table "virtual_source_table" add constraint "virtual_source_table_clip_id_foreign" foreign key ("clip_id") references "clip" ("id") on update cascade;');
  }

}
