import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class ClipLatesteditatMigration implements MigrationInterface {
  name = "clip-latesteditat-1650792724186";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "clip"
      ADD
        "latest_edit_at" TIMESTAMP(3) NOT NULL
      DEFAULT CURRENT_TIMESTAMP
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "clip" DROP COLUMN "latest_edit_at"
    `);
  }
}
