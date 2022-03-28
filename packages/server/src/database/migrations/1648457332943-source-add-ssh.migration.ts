import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class SourceAddSshMigration implements MigrationInterface {
  name = "source-add-ssh-1648457332943";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ADD
        "ssh_enabled" boolean NOT NULL DEFAULT false
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ADD
        "ssh_host" character varying
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ADD
        "ssh_port" integer
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ADD
        "ssh_username" character varying
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ADD
        "ssh_password" character varying
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source"
      ADD
        "ssh_key" character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source" DROP COLUMN "ssh_key"
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source" DROP COLUMN "ssh_password"
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source" DROP COLUMN "ssh_username"
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source" DROP COLUMN "ssh_port"
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source" DROP COLUMN "ssh_host"
    `);

    await queryRunner.query(/* SQL */ `
      ALTER TABLE
        "source" DROP COLUMN "ssh_enabled"
    `);
  }
}
