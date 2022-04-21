import { createEntityService } from "@nest-boot/database";
import { mixinConnection } from "@nest-boot/graphql";
import { mixinSearchable } from "@nest-boot/search";
import { Injectable } from "@nestjs/common";

import { Chart } from "../entities/chart.entity";

@Injectable()
export class ChartService extends mixinConnection(
  mixinSearchable(createEntityService(Chart), {
    index: "Chart",
    searchableAttributes: ["id", "name"],
    sortableAttributes: [],
  })
) {}
