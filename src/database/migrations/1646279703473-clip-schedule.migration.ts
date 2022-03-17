import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class ClipScheduleMigration implements MigrationInterface {
  name = "clip-schedule-1646279703473";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "clip"
      ADD
        "last_viewed_at" TIMESTAMP(3)
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "clip"
      ADD
        "latest_result_at" TIMESTAMP(3)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "clip" DROP COLUMN "latest_result_at"
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "clip" DROP COLUMN "last_viewed_at"
    `);
  }
}
