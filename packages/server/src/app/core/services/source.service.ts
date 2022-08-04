import { Logger } from "@nest-boot/common";
import { createEntityService } from "@nest-boot/database";
import { mixinConnection } from "@nest-boot/graphql";
import { mixinSearchable } from "@nest-boot/search";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import Bluebird, { promisify } from "bluebird";
import _ from "lodash";
import mysql, { FieldPacket, RowDataPacket } from "mysql2";
import pMysql from "mysql2/promise";
import pg, { QueryArrayResult } from "pg";
import initSqlJs from "sql.js";
import tunnelSSH from "tunnel-ssh";

import { CryptoService } from "../../../crypto";
import { Source } from "../entities/source.entity";
import { SourceType } from "../enums/source-type.enum";
import { ClipService } from "./clip.service";
import { VirtualSourceTableService } from "./virtual-source-table.service";

const createTunnel = promisify(tunnelSSH);

@Injectable()
export class SourceService extends mixinConnection(
  mixinSearchable(createEntityService(Source), {
    index: "Source",
    searchableAttributes: ["id", "name"],
    sortableAttributes: [],
  })
) {
  constructor(
    private readonly logger: Logger,
    private readonly cryptoService: CryptoService,
    @Inject(forwardRef(() => ClipService))
    private readonly clipService: ClipService,
    private readonly virtualSourceTableService: VirtualSourceTableService
  ) {
    super();
  }

  async checkConnect(input: Partial<Source>, id?: string): Promise<boolean> {
    if (id) {
      const source = await this.repository.findOneOrFail({ id });

      if (source.password) {
        // eslint-disable-next-line no-param-reassign
        input.password =
          input.password || this.cryptoService.decrypt(source.password);
      }

      if (source.sshPassword) {
        // eslint-disable-next-line no-param-reassign
        input.sshPassword =
          input.password || this.cryptoService.decrypt(source.sshPassword);
      }
    }

    const localHost = "localhost";
    const localPort = _.random(30000, 60000);

    const host = input.sshEnabled ? localHost : input.host;

    const port = input.sshEnabled ? localPort : input.port;

    const { database, username, password } = input;

    if (input.type !== SourceType.VIRTUAL && input.sshEnabled) {
      const tunnel = await createTunnel({
        host: input.sshHost,
        port: input.sshPort,
        username: input.sshUsername,
        password: input.sshPassword,
        dstHost: input.host,
        dstPort: input.port,
        localHost,
        localPort,
      });

      tunnel.on("error", (err) => {
        this.logger.error("SSH tunnel error", { err, sourceId: input.id });
      });
    }

    if (input.type === SourceType.MYSQL) {
      let mysqlConnection: pMysql.Connection;

      try {
        mysqlConnection = await pMysql.createConnection({
          host,
          port,
          user: username,
          password,
          database,
          rowsAsArray: true,
        });

        return true;
      } catch (err) {
        throw new Error("测试连接失败，请检查所填写的信息是否正确");
      } finally {
        await mysqlConnection?.end();
      }
    }

    if (input.type === SourceType.POSTGRESQL) {
      const pgClient = new pg.Client({
        host,
        port,
        user: username,
        password,
        database,
      });

      try {
        await pgClient.connect();

        return true;
      } catch (err) {
        throw new Error("测试连接失败，请检查所填写的信息是否正确");
      } finally {
        await pgClient.end();
      }
    }

    return false;
  }

  async create(input: Partial<Source>): Promise<Source> {
    if (input.password) {
      // eslint-disable-next-line no-param-reassign
      input.password = this.cryptoService.encrypt(input.password);
    }

    if (input.sshPassword) {
      // eslint-disable-next-line no-param-reassign
      input.sshPassword = this.cryptoService.encrypt(input.sshPassword);
    }

    const source = this.repository.create(input);

    await this.repository.persistAndFlush(source);

    return source;
  }

  async update(id: string, input: Partial<Source>): Promise<Source> {
    const source = await this.repository.findOneOrFail({ id });

    if (input.password) {
      // eslint-disable-next-line no-param-reassign
      input.password = this.cryptoService.encrypt(input.password);
    }

    if (input.sshPassword) {
      // eslint-disable-next-line no-param-reassign
      input.sshPassword = this.cryptoService.encrypt(input.sshPassword);
    }

    this.repository.assign(source, input);

    await this.repository.persistAndFlush(source);

    return source;
  }

  async query(
    source: Source,
    sql: string
  ): Promise<[string[], (string | number | boolean | Date)[][]]> {
    const localHost = "localhost";
    const localPort = _.random(30000, 60000);

    if (source.type !== SourceType.VIRTUAL && source.sshEnabled) {
      const tunnel = await createTunnel({
        host: source.sshHost,
        port: source.sshPort,
        username: source.sshUsername,
        password: source.sshPassword
          ? this.cryptoService.decrypt(source.sshPassword)
          : null,
        dstHost: source.host,
        dstPort: source.port,
        localHost,
        localPort,
      });

      tunnel.on("error", (err) => {
        this.logger.error("SSH tunnel error", { err, sourceId: source.id });
      });
    }

    const host = source.sshEnabled ? localHost : source.host;
    const port = source.sshEnabled ? localPort : source.port;

    const { database, username } = source;
    const password = source.password
      ? this.cryptoService.decrypt(source.password)
      : null;

    if (source.type === SourceType.MYSQL) {
      const mysqlConnection = mysql
        .createConnection({
          host,
          port,
          user: username,
          password,
          database,
          rowsAsArray: true,
        })
        .promise();

      let result: [RowDataPacket[], FieldPacket[]];
      try {
        result = await mysqlConnection.query(sql);
      } catch (err) {
        throw new Error(`[${err.sqlState}][${err.errno}] ${err.message}`);
      } finally {
        await mysqlConnection.end();
      }

      return [
        result[1].map((item) => item.name),
        result[0] as (string | number | boolean | Date)[][],
      ];
    }

    if (source.type === SourceType.POSTGRESQL) {
      const pgClient = new pg.Client({
        host,
        port,
        user: username,
        password,
        database,
      });
      await pgClient.connect();

      let result: QueryArrayResult<(string | number | boolean | Date)[]>;

      try {
        result = await pgClient.query({ rowMode: "array", text: sql });
      } catch (err) {
        throw new Error(
          `[${err.code}] ERROR: ${err.message}\n位置：${err.position}`
        );
      } finally {
        await pgClient.end();
      }

      return [result.fields.map((item) => item.name), result.rows];
    }

    if (source.type === SourceType.VIRTUAL) {
      const tables = await this.virtualSourceTableService.repository.find({
        source,
      });

      const { Database } = await initSqlJs();
      const db = new Database();

      await Bluebird.map(
        tables,
        async (table) => {
          const result = await this.clipService.query(table.clip.id, true);

          db.run(`CREATE TABLE ${table.name} (${result.fields.join(",")});`);

          if (result.values.length > 0) {
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
          }
        },
        { concurrency: 5 }
      );

      const [{ columns, values }] = db.exec(sql);

      return [columns, values as (string | number | boolean | Date)[][]];
    }

    return null;
  }
}
