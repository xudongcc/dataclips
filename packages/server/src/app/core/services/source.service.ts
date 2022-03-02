import {
  createEntityService,
  DeepPartial,
  FindConditions,
} from "@nest-boot/database";
import { mixinConnection } from "@nest-boot/graphql";
import { mixinSearchable } from "@nest-boot/search";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import Bluebird from "bluebird";
import mysql from "mysql2";
import pg from "pg";
import initSqlJs from "sql.js";

import { CryptoService } from "../../../crypto";
import { Source } from "../entities/source.entity";
import { SourceType } from "../enums/source-type.enum";
import { ClipService } from "./clip.service";
import { VirtualSourceTableService } from "./virtual-source-table.service";

@Injectable()
export class SourceService extends mixinConnection(
  mixinSearchable(createEntityService(Source))
) {
  constructor(
    private readonly cryptoService: CryptoService,
    @Inject(forwardRef(() => ClipService))
    private readonly clipService: ClipService,
    private readonly virtualSourceTableService: VirtualSourceTableService
  ) {
    super();
  }

  async create(input: DeepPartial<Source>): Promise<Source> {
    if (input.password) {
      // eslint-disable-next-line no-param-reassign
      input.password = this.cryptoService.encrypt(input.password);
    }

    return await super.create(input);
  }

  async update(
    conditions: FindConditions<Source>,
    input?: DeepPartial<Source>
  ): Promise<this> {
    if (input.password) {
      // eslint-disable-next-line no-param-reassign
      input.password = this.cryptoService.encrypt(input.password);
    }

    return await super.update(conditions, input);
  }

  async query(
    id: Source["id"],
    sql: string
  ): Promise<Record<string, string | number | boolean>[]> {
    const source = await this.findOne({ where: { id } });

    if (source.type === SourceType.MYSQL) {
      const mysqlConnection = mysql
        .createConnection({
          host: source.host,
          port: source.port,
          user: source.username,
          password: this.cryptoService.decrypt(source.password),
          database: source.database,
        })
        .promise();

      let result: Record<string, string | number | boolean>[];
      try {
        result = (await mysqlConnection.query(sql))?.[0] as Record<
          string,
          string | number | boolean
        >[];
      } catch (err) {
        throw new Error(`[${err.sqlState}][${err.errno}] ${err.message}`);
      }

      await mysqlConnection.end();

      return result;
    }

    if (source.type === SourceType.POSTGRESQL) {
      const pgClient = new pg.Client({
        host: source.host,
        port: source.port,
        user: source.username,
        password: this.cryptoService.decrypt(source.password),
        database: source.database,
      });
      await pgClient.connect();

      let result: Record<string, string | number | boolean>[];

      try {
        result = (await pgClient.query(sql))?.rows;
      } catch (err) {
        throw new Error(
          `[${err.code}] ERROR: ${err.message}\n位置：${err.position}`
        );
      }

      await pgClient.end();

      return result;
    }

    if (source.type === SourceType.VIRTUAL) {
      const tables = await this.virtualSourceTableService.findAll({
        where: { source },
      });

      const { Database } = await initSqlJs();
      const db = new Database();

      await Bluebird.map(
        tables,
        async (table) => {
          const result = await this.clipService.query(table.clipId);

          db.run(`CREATE TABLE ${table.name} (${result.fields.join(",")});`);

          db.run(
            `INSERT INTO ${table.name} VALUES ${result.values
              .map(
                (value) =>
                  `(${value
                    .map((val) => {
                      if (val === null) {
                        return "null";
                      }

                      switch (typeof val) {
                        case "number":
                          return val;
                        default:
                          return `'${val}'`;
                      }
                    })
                    .join(",")})`
              )
              .join(",")};`
          );
        },
        { concurrency: 5 }
      );

      // eslint-disable-next-line no-unsafe-optional-chaining
      const [{ columns, values }] = db.exec(sql);

      return values.map((value) => {
        const output = {};

        columns.forEach((column, index) => {
          output[column] = value[index];
        });

        return output;
      });
    }

    return null;
  }
}
