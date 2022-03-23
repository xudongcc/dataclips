import { createEntityService } from "@nest-boot/database";
import { mixinConnection } from "@nest-boot/graphql";
import { mixinSearchable } from "@nest-boot/search";
import { Injectable } from "@nestjs/common";

import { Dashboard } from "../entities/dashboard.entity";

@Injectable()
export class DashboardService extends mixinConnection(
  mixinSearchable(createEntityService(Dashboard))
) {}
