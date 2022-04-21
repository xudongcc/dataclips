import { QueryOrder } from "@mikro-orm/core";
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
    return this.clipService.repository.findOne({ id });
  }

  @Query(() => ClipConnection)
  async clips(@Args() args: QueryConnectionArgs): Promise<ClipConnection> {
    return await this.clipService.getConnection(args);
  }

  @Mutation(() => Clip)
  async createClip(@Args("input") input: CreateClipInput): Promise<Clip> {
    const clip = this.clipService.repository.create({
      ...input,
      source: { id: input.sourceId },
    });

    await this.clipService.repository.persistAndFlush(clip);

    return clip;
  }

  @Mutation(() => Clip)
  async updateClip(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateClipInput
  ): Promise<Clip> {
    const clip = await this.clipService.repository.findOneOrFail({ id });

    await this.clipService.query(id);

    return clip;
  }

  @Mutation(() => ID)
  async deleteClip(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    const clip = await this.clipService.repository.findOneOrFail({ id });
    await this.clipService.repository.persistAndFlush(clip);
    return id;
  }

  @ResolveField(() => [Result])
  async results(@Parent() clip: Clip): Promise<Result[]> {
    return this.resultService.repository.find(
      { clip },
      {
        limit: 10,
        orderBy: { createdAt: QueryOrder.DESC },
      }
    );
  }
}
