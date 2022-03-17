import { createEntityService } from "@nest-boot/database";
import { mixinConnection } from "@nest-boot/graphql";
import { mixinSearchable } from "@nest-boot/search";
import { Injectable } from "@nestjs/common";

import { Project } from "../entities/project.entity";

@Injectable()
export class ProjectService extends mixinConnection(
  mixinSearchable(createEntityService(Project))
) {}
