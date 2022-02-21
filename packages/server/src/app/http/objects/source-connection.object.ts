import { createConnection } from "@nest-boot/graphql";
import { ObjectType } from "@nestjs/graphql";

import { Source } from "../../core/entities/source.entity";

@ObjectType()
export class SourceConnection extends createConnection(Source) {}
