import {
  createEntityService,
  FindOneOptions,
  LessThan,
  MoreThan,
} from "@nest-boot/database";
import { mixinConnection } from "@nest-boot/graphql";
import { mixinSearchable } from "@nest-boot/search";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import _ from "lodash";
import moment from "moment";

import { Clip } from "../entities/clip.entity";
import { Result } from "../entities/result.entity";
import { RefreshClipQueue } from "../queues/refresh-clip.queue";
import { ResultService } from "./result.service";
import { SourceService } from "./source.service";

@Injectable()
export class ClipService extends mixinConnection(
  mixinSearchable(createEntityService(Clip))
) {
  constructor(
    @Inject(forwardRef(() => SourceService))
    private readonly sourceService: SourceService,
    private readonly resultService: ResultService,
    @Inject(forwardRef(() => RefreshClipQueue))
    private readonly refreshClipQueue: RefreshClipQueue
  ) {
    super();
  }

  async query(id: Clip["id"]): Promise<Result> {
    const clip = await this.findOne({ where: { id } });

    let queryResult: Record<string, string | number | boolean>[] = [];
    let error: any = null;

    const startedAt = new Date();

    try {
      queryResult = await this.sourceService.query(clip.sourceId, clip.sql);
    } catch (err) {
      error = err.message;

      // eslint-disable-next-line no-console
      console.error(err);
    }

    const finishedAt = new Date();

    let fields: string[] = [];
    let values: (string | number | boolean | Date)[][] = [];
    if (queryResult?.[0]) {
      fields = Object.keys(queryResult[0]);
      values = queryResult.map((item: any) => Object.values(item));
    }

    const [result] = await Promise.all([
      this.resultService.create({
        clip,
        name: clip.name,
        fields,
        values,
        error,
        duration: finishedAt.getTime() - startedAt.getTime(),
        startedAt,
        finishedAt,
      }),
      this.update({ id }, { latestResultAt: finishedAt }),
    ]);

    return result;
  }

  async findOneByToken(
    idOrToken: string,
    options?: FindOneOptions<Clip>
  ): Promise<Clip> {
    return await this.findOne({
      ...options,
      where: { token: idOrToken },
    });
  }

  async fetchResult(id: Clip["id"], sync = false) {
    const result = await this.resultService.findOne({
      where: { clip: { id } },
      order: { startedAt: "DESC" },
    });

    if (!result || moment().subtract(1, "m").isAfter(result.finishedAt)) {
      await this.refreshClipQueue.add("query", { clipId: id });
    }

    return result;
  }

  async schedule() {
    await this.chunkById(
      {
        where: {
          lastViewedAt: MoreThan(moment().subtract(7, "d").toDate()),
          latestResultAt: LessThan(moment().subtract(1, "h").toDate()),
        },
      },
      500,
      async (clips) => {
        await this.refreshClipQueue.addBulk(
          clips.map((clip) => ({
            name: "query",
            data: { clipId: clip.id },
          }))
        );
      }
    );
  }
}
