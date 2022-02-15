import { createConnection } from "@nest-boot/graphql";
import { ObjectType } from "@nestjs/graphql";

import { DataClip } from "../../core/entities/data-clip.entity";

@ObjectType()
export class DataClipConnection extends createConnection(DataClip) {}
