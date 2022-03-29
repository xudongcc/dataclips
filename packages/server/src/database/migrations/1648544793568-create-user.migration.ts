import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class CreateUserMigration implements MigrationInterface {
  name = "create-user-1648544793568";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      CREATE TABLE "user" (
        "id" bigint NOT NULL,
        "name" character varying NOT NULL,
        "email" character varying NOT NULL,
        "avatar" text,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
        CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      DROP TABLE "user"
    `);
  }
}
