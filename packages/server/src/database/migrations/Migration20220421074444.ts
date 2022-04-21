import { Migration } from '@mikro-orm/migrations';

export class Migration20220421074444 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" bigserial primary key, "name" varchar(255) not null, "email" varchar(255) not null, "avatar" text null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "source" ("id" bigserial primary key, "name" varchar(255) not null, "type" varchar(255) not null, "tags" jsonb not null, "host" varchar(255) null, "port" int null, "database" varchar(255) null, "username" varchar(255) null, "password" varchar(255) null, "ssh_enabled" boolean not null default false, "ssh_host" varchar(255) null, "ssh_port" int null, "ssh_username" varchar(255) null, "ssh_password" varchar(255) null, "ssh_key" varchar(255) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "project" ("id" bigserial primary key, "name" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "dashboard" ("id" bigserial primary key, "name" varchar(255) not null, "tags" jsonb not null, "token" varchar(255) null, "config" jsonb not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null);');

    this.addSql('create table "clip" ("id" bigserial primary key, "name" varchar(255) not null, "tags" jsonb not null, "token" varchar(255) null, "sql" varchar(255) not null, "last_viewed_at" timestamptz(0) null, "latest_result_at" timestamptz(0) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "source_id" bigint not null);');

    this.addSql('create table "result" ("id" bigserial primary key, "name" varchar(255) not null, "fields" jsonb not null, "values" jsonb not null, "error" text null, "duration" int not null, "started_at" timestamptz(0) null, "finished_at" timestamptz(0) null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "clip_id" bigint not null);');

    this.addSql('create table "virtual_source_table" ("id" bigserial primary key, "name" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "source_id" bigint not null, "clip_id" bigint not null);');

    this.addSql('create table "chart" ("id" bigserial primary key, "name" varchar(255) not null, "token" varchar(255) null, "type" text check ("type" in (\'FUNNEL\', \'METRIC\', \'LINE\', \'BAR\', \'PIE\', \'MD\')) not null, "tags" jsonb not null, "config" jsonb not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "clip_id" bigint not null);');

    this.addSql('alter table "clip" add constraint "clip_source_id_foreign" foreign key ("source_id") references "source" ("id") on update cascade;');

    this.addSql('alter table "result" add constraint "result_clip_id_foreign" foreign key ("clip_id") references "clip" ("id") on update cascade;');

    this.addSql('alter table "virtual_source_table" add constraint "virtual_source_table_source_id_foreign" foreign key ("source_id") references "source" ("id") on update cascade;');
    this.addSql('alter table "virtual_source_table" add constraint "virtual_source_table_clip_id_foreign" foreign key ("clip_id") references "clip" ("id") on update cascade;');

    this.addSql('alter table "chart" add constraint "chart_clip_id_foreign" foreign key ("clip_id") references "clip" ("id") on update cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "clip" drop constraint "clip_source_id_foreign";');

    this.addSql('alter table "virtual_source_table" drop constraint "virtual_source_table_source_id_foreign";');

    this.addSql('alter table "result" drop constraint "result_clip_id_foreign";');

    this.addSql('alter table "virtual_source_table" drop constraint "virtual_source_table_clip_id_foreign";');

    this.addSql('alter table "chart" drop constraint "chart_clip_id_foreign";');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "source" cascade;');

    this.addSql('drop table if exists "project" cascade;');

    this.addSql('drop table if exists "dashboard" cascade;');

    this.addSql('drop table if exists "clip" cascade;');

    this.addSql('drop table if exists "result" cascade;');

    this.addSql('drop table if exists "virtual_source_table" cascade;');

    this.addSql('drop table if exists "chart" cascade;');
  }

}
