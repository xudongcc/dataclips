import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class ChartFormatFieldMigration implements MigrationInterface {
  name = "chart-format-field-1648691432160";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "chart"
      ADD
        "format" character varying
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "dashboard"
      ALTER COLUMN
        "config"
      SET
        NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "dashboard"
      ALTER COLUMN
        "config" DROP NOT NULL
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "chart" DROP COLUMN "format"
    `);
  }
}
