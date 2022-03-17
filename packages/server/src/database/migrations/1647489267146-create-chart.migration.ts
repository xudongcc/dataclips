import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class CreateChartMigration implements MigrationInterface {
  name = "create-chart-1647489267146";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "result" DROP CONSTRAINT "FK_42a88f7a138a04f7e8eb29c0ba3"
    `);

    await queryRunner.query(/* SQL */ `
      CREATE TABLE "chart" (
        "id" bigint NOT NULL,
        "name" character varying NOT NULL,
        "token" character varying,
        "type" character varying NOT NULL,
        "config" json NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "clip_id" bigint,
        CONSTRAINT "PK_992ed0006df2077b57b2d06eea4" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "result"
      ADD
        CONSTRAINT "FK_42a88f7a138a04f7e8eb29c0ba3" FOREIGN KEY ("clip_id") REFERENCES "clip"("id") ON DELETE CASCADE ON
      UPDATE
        CASCADE
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "chart"
      ADD
        CONSTRAINT "FK_47d19b593efc2a7e009e9c260c6" FOREIGN KEY ("clip_id") REFERENCES "clip"("id") ON DELETE NO ACTION ON
      UPDATE
        NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "chart" DROP CONSTRAINT "FK_47d19b593efc2a7e009e9c260c6"
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "result" DROP CONSTRAINT "FK_42a88f7a138a04f7e8eb29c0ba3"
    `);

    await queryRunner.query(/* SQL */ `
      DROP TABLE "chart"
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "result"
      ADD
        CONSTRAINT "FK_42a88f7a138a04f7e8eb29c0ba3" FOREIGN KEY ("clip_id") REFERENCES "clip"("id") ON DELETE NO ACTION ON
      UPDATE
        NO ACTION
    `);
  }
}
