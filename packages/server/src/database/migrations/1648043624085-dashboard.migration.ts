import { MigrationInterface, QueryRunner } from "@nest-boot/database";

export class DashboardMigration implements MigrationInterface {
  name = "dashboard-1648043624085";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      CREATE TABLE "dashboard" (
        "id" bigint NOT NULL,
        "name" character varying NOT NULL,
        "token" character varying,
        "config" json NOT NULL,
        "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
        CONSTRAINT "PK_233ed28fa3a1f9fbe743f571f75" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* SQL */ `
      DROP TABLE "dashboard"
    `);
  }
}
