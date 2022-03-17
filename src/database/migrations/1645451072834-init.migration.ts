import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class InitMigration implements MigrationInterface {
  name = "init-1645451072834";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      CREATE TABLE "result" (
        "id" bigint NOT NULL,
        "fields" json NOT NULL,
        "values" json NOT NULL,
        "error" text,
        "duration" integer NOT NULL,
        "started_at" TIMESTAMP(3),
        "finished_at" TIMESTAMP(3),
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "clip_id" bigint,
        CONSTRAINT "PK_c93b145f3c2e95f6d9e21d188e2" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* SQL */ `
      CREATE TABLE "clip" (
        "id" bigint NOT NULL,
        "name" character varying NOT NULL,
        "slug" character varying NOT NULL,
        "sql" character varying NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "source_id" bigint,
        CONSTRAINT "PK_f0685dac8d4dd056d7255670b75" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* SQL */ `
      CREATE TABLE "source" (
        "id" bigint NOT NULL,
        "name" character varying NOT NULL,
        "type" character varying NOT NULL,
        "host" character varying NOT NULL,
        "port" integer NOT NULL,
        "database" character varying NOT NULL,
        "username" character varying NOT NULL,
        "password" character varying NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        CONSTRAINT "PK_018c433f8264b58c86363eaadde" PRIMARY KEY ("id")
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
        "result"
      ADD
        CONSTRAINT "FK_42a88f7a138a04f7e8eb29c0ba3" FOREIGN KEY ("clip_id") REFERENCES "clip"("id") ON DELETE NO ACTION ON
      UPDATE
        NO ACTION
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "clip"
      ADD
        CONSTRAINT "FK_726131f8f64ccc4408cc76ee8a4" FOREIGN KEY ("source_id") REFERENCES "source"("id") ON DELETE NO ACTION ON
      UPDATE
        NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "clip" DROP CONSTRAINT "FK_726131f8f64ccc4408cc76ee8a4"
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "result" DROP CONSTRAINT "FK_42a88f7a138a04f7e8eb29c0ba3"
    `);

    await queryRunner.query(/* SQL */ `
      DROP TABLE "project"
    `);

    await queryRunner.query(/* SQL */ `
      DROP TABLE "source"
    `);

    await queryRunner.query(/* SQL */ `
      DROP TABLE "clip"
    `);

    await queryRunner.query(/* SQL */ `
      DROP TABLE "result"
    `);
  }
}
