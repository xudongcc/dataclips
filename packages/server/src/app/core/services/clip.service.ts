import { createEntityService, FindOneOptions } from "@nest-boot/database";
import { mixinConnection } from "@nest-boot/graphql";
import { mixinSearchable } from "@nest-boot/search";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import moment from "moment";

import { Clip } from "../entities/clip.entity";
import { Result } from "../entities/result.entity";
import { ResultService } from "./result.service";
import { SourceService } from "./source.service";

@Injectable()
export class ClipService extends mixinConnection(
  mixinSearchable(createEntityService(Clip))
) {
  constructor(
    @Inject(forwardRef(() => SourceService))
    private readonly sourceService: SourceService,
    private readonly resultService: ResultService
  ) {
    super();
  }

  async query(id: Clip["id"]): Promise<Result> {
    const clip = await this.findOne({ where: { id } });

    let result: Record<string, string | number | boolean>[] = [];
    let error: any = null;

    const startedAt = new Date();

    try {
      result = await this.sourceService.query(clip.sourceId, clip.sql);
    } catch (err) {
      error = err.message;
    }

    const finishedAt = new Date();

    let fields: string[] = [];
    let values: (string | number | boolean | Date)[][] = [];
    if (result?.[0]) {
      fields = Object.keys(result[0]);
      values = result.map((item: any) => Object.values(item));
    }

    return await this.resultService.create({
      clip,
      name: clip.name,
      fields,
      values,
      error,
      duration: finishedAt.getTime() - startedAt.getTime(),
      startedAt,
      finishedAt,
    });
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

    if (!result || moment().subtract(1, "m").isAfter(result.finishedAt)) {
      await this.query(id);
    }

    return result;
  }
}
