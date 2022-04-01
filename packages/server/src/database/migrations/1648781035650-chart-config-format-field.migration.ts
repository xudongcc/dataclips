import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class ChartConfigFormatFieldMigration implements MigrationInterface {
  name = "chart-config-format-field-1648781035650";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "chart" DROP COLUMN "format"
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
        "chart"
      ADD
        "format" character varying
    `);
  }
}
