import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class AddClipTokenMigration implements MigrationInterface {
  name = "add-clip-token-1645863327499";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "clip" RENAME COLUMN "slug" TO "token"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "clip" RENAME COLUMN "token" TO "slug"
    `);
  }
}
