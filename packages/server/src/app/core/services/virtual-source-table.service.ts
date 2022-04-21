import { createEntityService } from "@nest-boot/database";
import { Injectable } from "@nestjs/common";

import { VirtualSourceTable } from "../entities/virtual-source-table.entity";

@Injectable()
export class VirtualSourceTableService extends createEntityService(
  VirtualSourceTable
) {}
