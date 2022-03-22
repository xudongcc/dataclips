import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class SourceMigration implements MigrationInterface {
  name = "source-1647595099245";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "virtual_source_table" DROP CONSTRAINT "FK_583a57862d11e703fa6b59a732b"
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "virtual_source_table"
      ADD
        CONSTRAINT "FK_583a57862d11e703fa6b59a732b" FOREIGN KEY ("source_id") REFERENCES "source"("id") ON DELETE CASCADE ON
      UPDATE
        CASCADE
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "virtual_source_table" DROP CONSTRAINT "FK_583a57862d11e703fa6b59a732b"
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "virtual_source_table"
      ADD
        CONSTRAINT "FK_583a57862d11e703fa6b59a732b" FOREIGN KEY ("source_id") REFERENCES "source"("id") ON DELETE NO ACTION ON
      UPDATE
        NO ACTION
    `);
  }
}
