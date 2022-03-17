import { createEntityService } from "@nest-boot/database";
import { mixinConnection } from "@nest-boot/graphql";
import { mixinSearchable } from "@nest-boot/search";
import { Injectable } from "@nestjs/common";

import { VirtualSourceTable } from "../entities/virtual-source-table.entity";

@Injectable()
export class VirtualSourceTableService extends mixinConnection(
  mixinSearchable(createEntityService(VirtualSourceTable))
) {}
