import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import Papa from "papaparse";
import xlsx from "node-xlsx";
import { ClipService } from "../../core/services";
import { ResultService } from "../../core/services/result.service";

@Controller("/clips")
export class ClipController {
  constructor(
    private readonly clipService: ClipService,
    private readonly resultService: ResultService
  ) {}

  @Get(":token.json")
  async json(@Param("token") token: string) {
    const clip = await this.clipService.findOneByIdOrToken(token);

    if (!clip) {
      throw new NotFoundException();
    }

    const result = await this.clipService.fetchResult(clip.id);

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  @Get(":token.csv")
  @Header("Content-Type", "text/csv")
  async csv(@Param("token") token: string) {
    const clip = await this.clipService.findOneByIdOrToken(token);

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
    const clip = await this.clipService.findOneByIdOrToken(token);

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
