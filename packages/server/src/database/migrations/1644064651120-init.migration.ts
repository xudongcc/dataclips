import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class InitMigration implements MigrationInterface {
  name = "init-1644064651120";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      CREATE TABLE "data_clip" (
        "id" bigint NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "tenant_id" bigint NOT NULL DEFAULT current_tenant_id(),
        "uuid" character varying NOT NULL,
        "name" character varying NOT NULL,
        "sql" character varying NOT NULL,
        "result" json,
        "data_source_id" bigint,
        CONSTRAINT "PK_a55d8cedea349407ff4fcebc39b" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* SQL */ `
      CREATE TABLE "data_source" (
        "id" bigint NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "tenant_id" bigint NOT NULL DEFAULT current_tenant_id(),
        "name" character varying NOT NULL,
        "type" character varying NOT NULL,
        "host" character varying NOT NULL,
        "port" integer NOT NULL,
        "database" character varying NOT NULL,
        "username" character varying NOT NULL,
        "password" character varying NOT NULL,
        CONSTRAINT "PK_9775f6b6312a926ed37d3af7d95" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* SQL */ `
      CREATE TABLE "project" (
        "id" bigint NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "name" character varying NOT NULL,
        CONSTRAINT "PK_4d68b1358bb5b766d3e78f32f57" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "data_clip"
      ADD
        CONSTRAINT "FK_acba6335e4137c46ed7c63483e1" FOREIGN KEY ("data_source_id") REFERENCES "data_source"("id") ON DELETE NO ACTION ON
      UPDATE
        NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "data_clip" DROP CONSTRAINT "FK_acba6335e4137c46ed7c63483e1"
    `);

    await queryRunner.query(/* SQL */ `
      DROP TABLE "project"
    `);

    await queryRunner.query(/* SQL */ `
      DROP TABLE "data_source"
    `);

    await queryRunner.query(/* SQL */ `
      DROP TABLE "data_clip"
    `);
  }
}
