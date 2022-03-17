import { createConnection } from "@nest-boot/graphql";
import { ObjectType } from "@nestjs/graphql";

import { SourceObject } from "./source.object";

@ObjectType()
export class SourceConnection extends createConnection(SourceObject) {}
