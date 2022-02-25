import "source-map-support/register";

import { execCli } from "@nest-boot/command";

import { ConsoleModule } from "./app/console/console.module";

import { SourceObject } from "./app/http/objects/source.object";

execCli(ConsoleModule.name);
