import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { FileUploadInput } from "./file-upload.input";

import { FileUpload } from "./file-upload.object";
import { FileUploadService } from "./file-upload.service";

@Resolver(() => FileUpload)
export class FileUploadResolver {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Mutation(() => [FileUpload])
  async createFileUploads(
    @Args({ type: () => [FileUploadInput], name: "input" })
    input: FileUploadInput[]
  ): Promise<FileUpload[]> {
    return this.fileUploadService.create(input);
  }
}
