import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class ChartTagsMigration implements MigrationInterface {
  name = "chart-tags-1650248318918";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "chart"
      ADD
        "tags" json
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "chart" DROP COLUMN "tags"
    `);
  }
}
