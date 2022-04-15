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

  async query(id: Clip["id"], throwError = false): Promise<Result> {
    const clip = await this.findOne({ where: { id } });

    let queryResult: [string[], unknown[][]];
    let queryError: Error;

    const startedAt = new Date();

    try {
      queryResult = await this.sourceService.query(clip.sourceId, clip.sql);
    } catch (err) {
      queryError = err;

      // eslint-disable-next-line no-console
      console.error(queryError);
    }

    const finishedAt = new Date();

    const [result] = await Promise.all([
      this.resultService.create({
        clip,
        name: clip.name,
        fields: queryResult?.[0] || [],
        values: queryResult?.[1] || [],
        error: queryError?.message,
        duration: finishedAt.getTime() - startedAt.getTime(),
        startedAt,
        finishedAt,
      }),
      this.update({ id }, { latestResultAt: finishedAt }),
    ]);

    if (queryError && throwError) {
      throw queryError;
    }

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
