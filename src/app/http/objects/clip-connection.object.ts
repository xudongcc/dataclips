import { createConnection } from "@nest-boot/graphql";
import { ObjectType } from "@nestjs/graphql";

import { Clip } from "../../core/entities/clip.entity";

@ObjectType()
export class ClipConnection extends createConnection(Clip) {}
