import { createConnection } from "@nest-boot/graphql";
import { ObjectType } from "@nestjs/graphql";

import { Dashboard } from "../../core/entities/dashboard.entity";

@ObjectType()
export class DashboardConnection extends createConnection(Dashboard) {}
