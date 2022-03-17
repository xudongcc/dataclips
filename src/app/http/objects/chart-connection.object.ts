import { createConnection } from "@nest-boot/graphql";
import { ObjectType } from "@nestjs/graphql";
import { Chart } from "../../core/entities/chart.entity";

@ObjectType()
export class ChartConnection extends createConnection(Chart) {}
