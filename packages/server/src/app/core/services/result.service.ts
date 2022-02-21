import { createEntityService } from "@nest-boot/database";
import { mixinConnection } from "@nest-boot/graphql";
import { mixinSearchable } from "@nest-boot/search";
import { Injectable } from "@nestjs/common";

import { Result } from "../entities/result.entity";

@Injectable()
export class ResultService extends mixinConnection(
  mixinSearchable(createEntityService(Result))
) {}
