import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class OtherTagMigration implements MigrationInterface {
  name = "other-tag-1650420678066";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ADD
        "tags" json NOT NULL DEFAULT '[]'
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "clip"
      ADD
        "tags" json NOT NULL DEFAULT '[]'
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "dashboard"
      ADD
        "tags" json NOT NULL DEFAULT '[]'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "dashboard" DROP COLUMN "tags"
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "clip" DROP COLUMN "tags"
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source" DROP COLUMN "tags"
    `);
  }
}
