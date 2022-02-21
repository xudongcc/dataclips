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

  @Get(":slug.json")
  async json(@Param("slug") slug: string) {
    const clip = await this.clipService.findOne({ where: { slug } });

    if (!clip) {
      throw new NotFoundException();
    }

    await this.clipService.query(clip.id);

    const result = await this.resultService.findOne({
      where: { clip },
      order: { startedAt: "DESC" },
    });

    if (!result) {
      throw new NotFoundException();
    }

    return result;
  }

  @Get(":slug.csv")
  @Header("Content-Type", "text/csv")
  async csv(@Param("slug") slug: string) {
    const clip = await this.clipService.findOne({ where: { slug } });

    if (!clip) {
      throw new NotFoundException();
    }

    await this.clipService.query(clip.id);

    const result = await this.resultService.findOne({
      where: { clip },
      order: { startedAt: "DESC" },
    });

    if (!result) {
      throw new NotFoundException();
    }

    return Papa.unparse({
      fields: result.fields,
      data: result.values,
    });
  }

  @Get(":slug.xlsx")
  async xlsx(@Res() res: Response, @Param("slug") slug: string) {
    const clip = await this.clipService.findOne({ where: { slug } });

    if (!clip) {
      throw new NotFoundException();
    }

    await this.clipService.query(clip.id);

    const result = await this.resultService.findOne({
      where: { clip },
      order: { startedAt: "DESC" },
    });

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
