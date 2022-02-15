import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Param,
} from "@nestjs/common";
import { DataClipService } from "../../core/services/data-clip.service";
import Papa from "papaparse";

@Controller("/projects/:projectId/clips")
export class ProjectDataClipController {
  constructor(private readonly dataClipService: DataClipService) {}

  @Get(":uuid.json")
  async json(@Param("uuid") uuid: string) {
    const dataClip = await this.dataClipService.findOne({ where: { uuid } });

    if (!dataClip) {
      throw new NotFoundException();
    }

    await this.dataClipService.query(dataClip.id);

    return dataClip.result;
  }

  @Get(":uuid.csv")
  @Header("Content-Type", "text/csv")
  async csv(@Param("uuid") uuid: string) {
    const dataClip = await this.dataClipService.findOne({ where: { uuid } });

    if (!dataClip) {
      throw new NotFoundException();
    }

    await this.dataClipService.query(dataClip.id);

    return Papa.unparse(dataClip.result);
  }
}
