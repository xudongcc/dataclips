import { QueryConnectionArgs } from "@nest-boot/graphql";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Clip } from "../../core/entities";
import { ClipService } from "../../core/services/clip.service";
import { CreateClipInput } from "../inputs/create-clip.input";
import { UpdateClipInput } from "../inputs/update-clip.input";
import { ClipConnection } from "../objects/clip-connection.object";

@Resolver(() => Clip)
export class ClipResolver {
  constructor(private readonly clipService: ClipService) {}

  @Query(() => Clip)
  async clip(@Args("id", { type: () => ID }) id: string): Promise<Clip> {
    return this.clipService.findOne({ where: { id } });
  }

  @Query(() => ClipConnection)
  async clips(@Args() args: QueryConnectionArgs): Promise<ClipConnection> {
    return this.clipService.getConnection(args);
  }

  @Mutation(() => Clip)
  async createClip(@Args("input") input: CreateClipInput): Promise<Clip> {
    return this.clipService.create({
      ...input,
      source: { id: input.sourceId },
    });
  }

  @Mutation(() => Clip)
  async updateClip(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateClipInput
  ): Promise<Clip> {
    await this.clipService.update({ id }, input);
    return this.clipService.findOne({ where: { id } });
  }

  @Mutation(() => ID)
  async deleteClip(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    await this.clipService.delete({ id });
    return id;
  }
}
