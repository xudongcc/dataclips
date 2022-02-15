import { BadRequestException, Injectable } from "@nestjs/common";

import { FileUpload } from "./file-upload.object";
import { FileUploadInput } from "./file-upload.input";
import { randomUUID } from "crypto";
import { FileUploadLimit, FileUploadModuleOptions } from "./file-upload.module";
import { S3 } from "aws-sdk";

@Injectable()
export class FileUploadService {
  private readonly s3: S3;

  constructor(private readonly options: FileUploadModuleOptions) {
    this.s3 = new S3(options);
  }

  async create(input: FileUploadInput[]): Promise<FileUpload[]> {
    const acl = "private";

    return input.map((item) => {
      const key = `tmp/${randomUUID()}/${item.name}`;

      const limit =
        this.options.limits &&
        this.options.limits.find(
          (limit) =>
            item.fileSize <= limit.fileSize &&
            limit.mimeTypes.includes(item.mimeType)
        );

      if (this.options.limits && !limit) {
        throw new BadRequestException("limit");
      }

      const presignedPost = this.s3.createPresignedPost({
        Bucket: this.options.bucket,
        Expires: this.options.expires,
        Fields: {
          acl,
          key,
          success_action_status: "201",
          "Content-Type": item.mimeType,
        },
        Conditions: [
          ...(limit ? [["content-length-range", 1, limit.fileSize]] : []),
          ["eq", "$acl", acl],
          ["eq", "$key", key],
          ["eq", "$success_action_status", "201"],
          ["eq", "$Content-Type", item.mimeType],
        ],
      });

      return {
        url: presignedPost.url,
        fields: Object.entries(presignedPost.fields).map(([name, value]) => ({
          name,
          value,
        })),
      };
    });
  }
}
