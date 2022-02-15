import { QueryConnectionArgs } from "@nest-boot/graphql";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Project } from "../../core/entities";

import { ProjectService } from "../../core/services/project.service";
import { CreateProjectInput } from "../inputs/create-project.input";
import { UpdateProjectInput } from "../inputs/update-project.input";
import { ProjectConnection } from "../objects/project-connection.object";

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => Project)
  async project(@Args("id", { type: () => ID }) id: string): Promise<Project> {
    return this.projectService.findOne({ where: { id } });
  }

  @Query(() => ProjectConnection)
  async projects(
    @Args() args: QueryConnectionArgs
  ): Promise<ProjectConnection> {
    return this.projectService.getConnection(args);
  }

  @Mutation(() => Project)
  async createProject(
    @Args("input") input: CreateProjectInput
  ): Promise<Project> {
    return this.projectService.create(input);
  }

  @Mutation(() => Project)
  async updateProject(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateProjectInput
  ): Promise<Project> {
    await this.projectService.update({ id }, input);
    return this.projectService.findOne({ where: { id } });
  }

  @Mutation(() => ID)
  async deleteProject(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    await this.projectService.delete({ id });
    return id;
  }
}
