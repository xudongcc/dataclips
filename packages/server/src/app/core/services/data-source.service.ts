import { createEntityService } from "@nest-boot/database";
import { mixinSearchable } from "@nest-boot/search";
import { mixinConnection } from "@nest-boot/graphql";
import { Injectable } from "@nestjs/common";
import knex from "knex";

import { DataSource } from "../entities/data-source.entity";
import { DataSourceType } from "../enums/data-source-type.enum";

@Injectable()
export class DataSourceService extends mixinConnection(
  mixinSearchable(createEntityService(DataSource))
) {
  async query(
    id: DataSource["id"],
    sql: string
  ): Promise<Record<string, string | number | boolean>[]> {
    const dataSource = await this.findOne({ where: { id } });

    let driver: "mysql2" | "pg";
    switch (dataSource.type) {
      case DataSourceType.MYSQL:
        driver = "mysql2";
      case DataSourceType.POSTGRESQL:
        driver = "pg";
    }

    const client = knex({
      client: driver,
      connection: {
        host: dataSource.host,
        port: dataSource.port,
        user: dataSource.username,
        password: dataSource.password,
        database: dataSource.database,
      },
    });

    const result = await client.raw(sql);

    await client.destroy();

    return result.rows;
  }
}
