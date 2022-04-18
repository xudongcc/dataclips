import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class ChartTagsMigration implements MigrationInterface {
  name = "chart-tags-1650261170178";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "chart"
      ADD
        "tags" json NOT NULL DEFAULT '[]'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "chart" DROP COLUMN "tags"
    `);
  }
}
