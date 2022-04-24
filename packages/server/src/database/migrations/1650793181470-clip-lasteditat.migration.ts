import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class ClipLasteditatMigration implements MigrationInterface {
  name = "clip-lasteditat-1650793181470";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "clip"
      ADD
        "last_edit_at" TIMESTAMP(3) NOT NULL
      DEFAULT CURRENT_TIMESTAMP
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "clip" DROP COLUMN "last_edit_at"
    `);
  }
}
