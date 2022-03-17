import { createConnection } from "@nest-boot/graphql";
import { ObjectType } from "@nestjs/graphql";

import { Project } from "../../core/entities/project.entity";

@ObjectType()
export class ProjectConnection extends createConnection(Project) {}
