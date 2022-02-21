import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
} from "@nestjs/common";
import Papa from "papaparse";
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
    const result = await this.resultService.findOne({
      where: { clip: { slug } },
      order: { startedAt: "DESC" },
      relations: ["clip"],
    });

    if (!result) {
      throw new NotFoundException();
    }

    return null;
  }
}
