import { createEntityService } from "@nest-boot/database";
import { Injectable } from "@nestjs/common";

import { Result } from "../entities/result.entity";

@Injectable()
export class ResultService extends createEntityService(Result) {}
