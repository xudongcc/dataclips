import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class ResultAddNameMigration implements MigrationInterface {
  name = "result-add-name-1645536574501";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "result"
      ADD
        "name" character varying NOT NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "result" DROP COLUMN "name"
    `);
  }
}
