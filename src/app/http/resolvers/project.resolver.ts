import { QueryConnectionArgs } from "@nest-boot/graphql";
import { Args, ID, Mutation, Query, Resolver } from "@nestjs/graphql";

import { Project } from "../../core/entities/project.entity";
import { ProjectService } from "../../core/services/project.service";
import { CreateProjectInput } from "../inputs/create-project.input";
import { UpdateProjectInput } from "../inputs/update-project.input";
import { ProjectConnection } from "../objects/project-connection.object";

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => Project)
  async project(@Args("id", { type: () => ID }) id: string): Promise<Project> {
    return await this.projectService.findOne({ where: { id } });
  }

  @Query(() => ProjectConnection)
  async projects(
    @Args() args: QueryConnectionArgs
  ): Promise<ProjectConnection> {
    return await this.projectService.getConnection(args);
  }

  @Mutation(() => Project)
  async createProject(
    @Args("input") input: CreateProjectInput
  ): Promise<Project> {
    return await this.projectService.create(input);
  }

  @Mutation(() => Project)
  async updateProject(
    @Args("id", { type: () => ID }) id: string,
    @Args("input") input: UpdateProjectInput
  ): Promise<Project> {
    await this.projectService.update({ id }, input);
    return await this.projectService.findOne({ where: { id } });
  }

  @Mutation(() => ID)
  async deleteProject(
    @Args("id", { type: () => ID }) id: string
  ): Promise<string> {
    await this.projectService.delete({ id });
    return id;
  }
}
