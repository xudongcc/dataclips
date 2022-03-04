import {
  DynamicModule,
  Module,
  ModuleMetadata,
  Provider,
} from "@nestjs/common";
import { S3 } from "aws-sdk";

import { FileUploadResolver } from "./file-upload.resolver";
import { FileUploadService } from "./file-upload.service";

export interface FileUploadLimit {
  fileSize: number;
  mimeTypes: string[];
}

export interface FileUploadModuleOptions extends S3.ClientConfiguration {
  bucket: string;
  expires?: number;
  limits?: FileUploadLimit[];
}

export interface FileUploadModuleAsyncOptions
  extends Pick<ModuleMetadata, "imports"> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  inject?: any[];
  useFactory: (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ...args: any[]
  ) => Promise<FileUploadModuleOptions> | FileUploadModuleOptions;
}

@Module({})
export class FileUploadModule {
  static register(options?: FileUploadModuleOptions): DynamicModule {
    const providers = [
      {
        provide: FileUploadService,
        useValue: new FileUploadService(options),
      },
    ];

    return {
      module: FileUploadModule,
      providers: [FileUploadResolver, ...providers],
      exports: [],
    };
  }

  static registerAsync(options: FileUploadModuleAsyncOptions): DynamicModule {
    const providers = this.createAsyncProviders(options);

    return {
      module: FileUploadModule,
      imports: options.imports,
      providers: [FileUploadResolver, ...providers],
      exports: [],
    };
  }

  private static createAsyncProviders(
    options: FileUploadModuleAsyncOptions
  ): Provider[] {
    return [
      {
        provide: FileUploadService,
        inject: options.inject || [],
        useFactory: async (...args) =>
          new FileUploadService(await options.useFactory(...args)),
      },
    ];
  }
}
