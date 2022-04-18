import { Logger } from "@nest-boot/common";
import {
  createEntityService,
  DeepPartial,
  FindConditions,
} from "@nest-boot/database";
import { mixinConnection } from "@nest-boot/graphql";
import { mixinSearchable } from "@nest-boot/search";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import Bluebird, { promisify } from "bluebird";
import _ from "lodash";
import mysql, { FieldPacket, RowDataPacket } from "mysql2";
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
  mixinSearchable(createEntityService(Source))
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

  async create(input: DeepPartial<Source>): Promise<Source> {
    if (input.password) {
      // eslint-disable-next-line no-param-reassign
      input.password = this.cryptoService.encrypt(input.password);
    }

    if (input.sshPassword) {
      // eslint-disable-next-line no-param-reassign
      input.sshPassword = this.cryptoService.encrypt(input.sshPassword);
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

    if (input.sshPassword) {
      // eslint-disable-next-line no-param-reassign
      input.sshPassword = this.cryptoService.encrypt(input.sshPassword);
    }

    return await super.update(conditions, input);
  }

  async query(id: Source["id"], sql: string): Promise<[string[], unknown[][]]> {
    const source = await this.findOne({ where: { id } });

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
        await mysqlConnection.end();
        throw new Error(`[${err.sqlState}][${err.errno}] ${err.message}`);
      } finally {
        await mysqlConnection.end();
      }

      return [result[1].map((item) => item.name), result[0] as unknown[][]];
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

      let result: QueryArrayResult<unknown[]>;

      try {
        result = await pgClient.query({ rowMode: "array", text: sql });
      } catch (err) {
        await pgClient.end();
        throw new Error(
          `[${err.code}] ERROR: ${err.message}\n位置：${err.position}`
        );
      } finally {
        await pgClient.end();
      }

      return [result.fields.map((item) => item.name), result.rows];
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
          const result = await this.clipService.query(table.clipId, true);

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

      return [columns, values];
    }

    return null;
  }
}
