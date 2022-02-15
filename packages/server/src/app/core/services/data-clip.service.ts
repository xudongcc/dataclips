import { createEntityService } from "@nest-boot/database";
import { mixinSearchable } from "@nest-boot/search";
import { mixinConnection } from "@nest-boot/graphql";
import { Injectable } from "@nestjs/common";

import { DataClip } from "../entities/data-clip.entity";
import { DataSourceService } from "./data-source.service";

@Injectable()
export class DataClipService extends mixinConnection(
  mixinSearchable(createEntityService(DataClip))
) {
  constructor(private readonly dataSourceService: DataSourceService) {
    super();
  }

  async query(id: DataClip["id"]) {
    const dataClip = await this.findOne({ where: { id } });

    const result = await this.dataSourceService.query(
      dataClip.dataSourceId,
      dataClip.sql
    );

    await this.update({ id }, { result });

    return result;
  }
}
