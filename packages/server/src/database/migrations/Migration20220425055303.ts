import { Migration } from '@mikro-orm/migrations';

export class Migration20220425055303 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "result" drop constraint "result_clip_id_foreign";');

    this.addSql('alter table "result" add constraint "result_clip_id_foreign" foreign key ("clip_id") references "clip" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "result" drop constraint "result_clip_id_foreign";');

    this.addSql('alter table "result" add constraint "result_clip_id_foreign" foreign key ("clip_id") references "clip" ("id") on update cascade;');
  }

}
