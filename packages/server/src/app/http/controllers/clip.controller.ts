import { FilterQuery } from "@mikro-orm/core";
import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  Query,
  Res,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { Response } from "express";
import moment from "moment";
import xlsx from "node-xlsx";
import Papa from "papaparse";

import { Result } from "../../core/entities/result.entity";
import { ClipService } from "../../core/services/clip.service";
import { AuthGuard } from "../guards/auth.guard";
import { ClipViewLoggingInterceptor } from "../interceptors/clip-view-logging.interceptor";

@UseGuards(AuthGuard)
@UseInterceptors(ClipViewLoggingInterceptor)
@Controller("/clips")
export class ClipController {
  constructor(private readonly clipService: ClipService) {}

  @Get(":id(\\d+).json")
  async json(@Param("id") id: string, @Query("time") time: string) {
    const clip = await this.clipService.repository.findOneOrFail({ id });

    const filterQuery: FilterQuery<Result> = {};

    if (time) {
      filterQuery.finishedAt = new Date(time);
    }

    const result = await this.clipService.fetchResult(clip.id, filterQuery);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  @Get(":id(\\d+).csv")
  @Header("Content-Type", "text/csv")
  async csv(@Param("id") id: string) {
    const clip = await this.clipService.repository.findOne({ id });

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

  @Get(":id(\\d+).xlsx")
  async xlsx(@Res() res: Response, @Param("id") id: string) {
    const clip = await this.clipService.repository.findOne({ id });

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
