import { createEntityService, FindOneOptions } from "@nest-boot/database";
import { mixinConnection } from "@nest-boot/graphql";
import { mixinSearchable } from "@nest-boot/search";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import _ from "lodash";
import moment from "moment";

import { Clip } from "../entities/clip.entity";
import { Result } from "../entities/result.entity";
import { RefreshClipJob } from "../jobs/refresh-clip.job";
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
    @Inject(forwardRef(() => RefreshClipJob))
    private readonly refreshClipJob: RefreshClipJob
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

  async findOneByIdOrToken(
    idOrToken: string,
    options?: FindOneOptions<Clip>
  ): Promise<Clip> {
    return await this.findOne({
      ...options,
      where: /^\d+$/.test(idOrToken) ? { id: idOrToken } : { token: idOrToken },
    });
  }

  async fetchResult(id: Clip["id"]) {
    const result = await this.resultService.findOne({
      where: { clip: { id } },
      order: { startedAt: "DESC" },
    });

    await this.refreshClipJob.dispatch({ clipId: id });

    // if (!result || moment().subtract(1, "m").isAfter(result.finishedAt)) {
    //   await this.refreshClipJob.dispatch({ clipId: id });
    // }

    return result;
  }
}
