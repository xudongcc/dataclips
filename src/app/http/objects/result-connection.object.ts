import { createConnection } from "@nest-boot/graphql";
import { ObjectType } from "@nestjs/graphql";

import { Result } from "../../core/entities/result.entity";

@ObjectType()
export class ResultConnection extends createConnection(Result) {}
