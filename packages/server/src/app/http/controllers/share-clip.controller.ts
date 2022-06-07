import { FilterQuery } from "@mikro-orm/core";
import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  Query,
  Res,
  UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";
import xlsx from "node-xlsx";
import Papa from "papaparse";

import { Result } from "../../core/entities/result.entity";
import { ClipService } from "../../core/services/clip.service";
import { ClipViewLoggingInterceptor } from "../interceptors/clip-view-logging.interceptor";

@Controller("/clips")
@UseInterceptors(ClipViewLoggingInterceptor)
export class ShareClipController {
  constructor(private readonly clipService: ClipService) {}

  @Get(":token.json")
  async json(@Param("token") token: string, @Query("time") time: string) {
    const clip = await this.clipService.repository.findOneOrFail({ token });

    const filterQuery: FilterQuery<Result> = {};

    if (time) {
      filterQuery.finishedAt = time;
    }

    const result = await this.clipService.fetchResult(clip.id, filterQuery);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  @Get(":token.csv")
  @Header("Content-Type", "text/csv")
  async csv(@Param("token") token: string) {
    const clip = await this.clipService.repository.findOneOrFail({ token });

    if (!clip) {
      throw new NotFoundException();
    }

    const result = await this.clipService.fetchResult(clip.id);

    if (!result) {
      throw new NotFoundException();
    }

    return Papa.unparse({
      fields: result.fields,
      data: result.values,
    });
  }

  @Get(":token.xlsx")
  async xlsx(@Res() res: Response, @Param("token") token: string) {
    const clip = await this.clipService.repository.findOneOrFail({ token });

    if (!clip) {
      throw new NotFoundException();
    }

    const result = await this.clipService.fetchResult(clip.id);

    if (!result) {
      throw new NotFoundException();
    }

    res
      .setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
      .send(
        xlsx.build([
          {
            name: "Sheet1",
            data: [result.fields, ...result.values],
            options: {},
          },
        ])
      )
      .end();
  }
}
