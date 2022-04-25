import { QueryOrder } from "@mikro-orm/core";
import { createEntityService } from "@nest-boot/database";
import { mixinConnection } from "@nest-boot/graphql";
import { mixinSearchable } from "@nest-boot/search";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import moment from "moment";

import { Clip } from "../entities/clip.entity";
import { Result } from "../entities/result.entity";
import { RefreshClipQueue } from "../queues/refresh-clip.queue";
import { ResultService } from "./result.service";
import { SourceService } from "./source.service";

@Injectable()
export class ClipService extends mixinConnection(
  mixinSearchable(createEntityService(Clip), {
    index: "Clip",
    searchableAttributes: ["id", "name"],
    sortableAttributes: [],
  })
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
    const clip = await this.repository.findOneOrFail(
      { id },
      { populate: ["source"] }
    );

    let queryResult: [string[], (string | number | boolean | Date)[][]];
    let queryError: Error;

    const startedAt = new Date();

    try {
      queryResult = await this.sourceService.query(
        clip.source.getEntity(),
        clip.sql
      );
    } catch (err) {
      queryError = err;

      // eslint-disable-next-line no-console
      console.error(queryError);
    }

    const finishedAt = new Date();

    const result = this.resultService.repository.create({
      clip,
      name: clip.name,
      fields: queryResult?.[0] || [],
      values: queryResult?.[1] || [],
      error: queryError?.message,
      duration: finishedAt.getTime() - startedAt.getTime(),
      startedAt,
      finishedAt,
    });

    clip.latestResultAt = finishedAt;

    console.log("result", result);

    await this.resultService.repository.persistAndFlush(result);

    if (queryError && throwError) {
      throw queryError;
    }

    return result;
  }

  async fetchResult(id: Clip["id"], sync = false) {
    const result = await this.resultService.repository.findOne(
      { clip: { id } },
      {
        orderBy: { startedAt: QueryOrder.DESC },
      }
    );

    if (!result || moment().subtract(1, "m").isAfter(result.finishedAt)) {
      await this.refreshClipQueue.add("query", { clipId: id });
    }

    return result;
  }

  async schedule() {
    await this.chunkById(
      {
        lastViewedAt: {
          $gt: moment().subtract(7, "d").toDate(),
        },
        latestResultAt: {
          $lt: moment().subtract(1, "h").toDate(),
        },
      },
      { limit: 500 },
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
