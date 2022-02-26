import {
  createEntityService,
  DeepPartial,
  FindConditions,
} from "@nest-boot/database";
import { mixinSearchable } from "@nest-boot/search";
import { mixinConnection } from "@nest-boot/graphql";
import { Injectable } from "@nestjs/common";
import mysql from "mysql2";
import pg from "pg";
import { Source } from "../entities/source.entity";
import { SourceType } from "../enums/source-type.enum";
import { CryptoService } from "../../../crypto";

@Injectable()
export class SourceService extends mixinConnection(
  mixinSearchable(createEntityService(Source))
) {
  constructor(private readonly cryptoService: CryptoService) {
    super();
  }

  async create(input: DeepPartial<Source>): Promise<Source> {
    input.password = this.cryptoService.encrypt(input.password);
    return super.create(input);
  }

  async update(
    conditions: FindConditions<Source>,
    input?: DeepPartial<Source>
  ): Promise<this> {
    input.password = this.cryptoService.encrypt(input.password);
    return super.update(conditions, input);
  }

  async query(
    id: Source["id"],
    sql: string
  ): Promise<Record<string, string | number | boolean>[]> {
    const source = await this.findOne({ where: { id } });

    let result: any;
    switch (source.type) {
      case SourceType.MYSQL:
        const mysqlConnection = mysql
          .createConnection({
            host: source.host,
            port: source.port,
            user: source.username,
            password: this.cryptoService.decrypt(source.password),
            database: source.database,
          })
          .promise();

        try {
          result = (await mysqlConnection.query(sql))?.[0];
        } catch (err) {
          throw new Error(`[${err.sqlState}][${err.errno}] ${err.message}`);
        }

        await mysqlConnection.end();
        break;
      case SourceType.POSTGRESQL:
        const pgClient = new pg.Client({
          host: source.host,
          port: source.port,
          user: source.username,
          password: this.cryptoService.decrypt(source.password),
          database: source.database,
        });
        await pgClient.connect();

        try {
          result = (await pgClient.query(sql))?.rows;
        } catch (err) {
          throw new Error(
            `[${err.code}] ERROR: ${err.message}\n位置：${err.position}`
          );
        }

        await pgClient.end();
        break;
    }

    return result;
  }
}
