import { QueryConnectionArgs } from "@nest-boot/graphql";
import { UseGuards } from "@nestjs/common";
import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from "@nestjs/graphql";
import _ from "lodash";

import { Clip } from "../../core/entities/clip.entity";
import { Result } from "../../core/entities/result.entity";
import { ClipService } from "../../core/services/clip.service";
import { ResultService } from "../../core/services/result.service";
import { AuthGuard } from "../guards/auth.guard";
import { CreateClipInput } from "../inputs/create-clip.input";
import { UpdateClipInput } from "../inputs/update-clip.input";
import { ClipConnection } from "../objects/clip-connection.object";

@UseGuards(AuthGuard)
@Resolver(() => Clip)
export class ClipResolver {
  constructor(
    private readonly clipService: ClipService,
    private readonly resultService: ResultService
  ) {}

  @Query(() => Clip)
  async clip(@Args("id", { type: () => ID }) id: string): Promise<Clip> {
    return await this.clipService.findOne({ where: { id } });
  }

  @Query(() => ClipConnection)
  async clips(@Args() args: QueryConnectionArgs): Promise<ClipConnection> {
    return await this.clipService.getConnection(args);
  }

  @Mutation(() => Clip)
  async createClip(@Args("input") input: CreateClipInput): Promise<Clip> {
    return await this.clipService.create({
      ...input,
      source: { id: input.sourceId },
      latestEditAt: new Date(),
    });
  }

  @Mutation(() => Clip)
  async updateClip(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateClipInput
  ): Promise<Clip> {
    await this.clipService.update(
      { id },
      {
        ..._.omit(input, "sourceId"),
        ...(input.sourceId ? { source: { id: input.sourceId } } : {}),
        latestEditAt: new Date(),
      }
    );

    await this.clipService.query(id);

    return await this.clipService.findOne({ where: { id } });
  }

  @Mutation(() => ID)
  async deleteClip(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    await this.clipService.delete({ id });
    return id;
  }

  @ResolveField(() => [Result])
  async results(@Parent() clip: Clip): Promise<Result[]> {
    return await this.resultService.findAll({
      where: {
        clip: { id: clip.id },
      },
      take: 10,
      order: { createdAt: "DESC" },
    });
  }
}
