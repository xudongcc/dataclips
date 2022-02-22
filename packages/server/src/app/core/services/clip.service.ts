import { createEntityService } from "@nest-boot/database";
import { mixinSearchable } from "@nest-boot/search";
import { mixinConnection } from "@nest-boot/graphql";
import { Injectable } from "@nestjs/common";

import { Clip } from "../entities/clip.entity";
import { SourceService } from "./source.service";
import { ResultService } from "./result.service";
import { Result } from "../entities/result.entity";
import moment from "moment";

@Injectable()
export class ClipService extends mixinConnection(
  mixinSearchable(createEntityService(Clip))
) {
  constructor(
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
    let values: (string | number | boolean | Date)[][] = [[]];
    if (result?.[0]) {
      fields = Object.keys(result[0]);
      values = result.map((item: any) => Object.values(item));
    }

    return this.resultService.create({
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
