import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class VirtualSourceMigration implements MigrationInterface {
  name = "virtual-source-1645886648428";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      CREATE TABLE "virtual_source_table" (
        "id" bigint NOT NULL,
        "name" character varying NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "source_id" bigint,
        "clip_id" bigint,
        CONSTRAINT "PK_4561dd805d981676c79243e1550" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ALTER COLUMN
        "host" DROP NOT NULL
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ALTER COLUMN
        "port" DROP NOT NULL
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ALTER COLUMN
        "database" DROP NOT NULL
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ALTER COLUMN
        "username" DROP NOT NULL
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ALTER COLUMN
        "password" DROP NOT NULL
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "clip"
      ALTER COLUMN
        "token" DROP NOT NULL
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "virtual_source_table"
      ADD
        CONSTRAINT "FK_583a57862d11e703fa6b59a732b" FOREIGN KEY ("source_id") REFERENCES "source"("id") ON DELETE NO ACTION ON
      UPDATE
        NO ACTION
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "virtual_source_table"
      ADD
        CONSTRAINT "FK_557f77bd3f1615cc5a2f7694c75" FOREIGN KEY ("clip_id") REFERENCES "clip"("id") ON DELETE NO ACTION ON
      UPDATE
        NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "virtual_source_table" DROP CONSTRAINT "FK_557f77bd3f1615cc5a2f7694c75"
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "virtual_source_table" DROP CONSTRAINT "FK_583a57862d11e703fa6b59a732b"
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "clip"
      ALTER COLUMN
        "token"
      SET
        NOT NULL
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ALTER COLUMN
        "password"
      SET
        NOT NULL
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ALTER COLUMN
        "username"
      SET
        NOT NULL
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ALTER COLUMN
        "database"
      SET
        NOT NULL
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ALTER COLUMN
        "port"
      SET
        NOT NULL
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ALTER COLUMN
        "host"
      SET
        NOT NULL
    `);

    await queryRunner.query(/* SQL */ `
      DROP TABLE "virtual_source_table"
    `);
  }
}
