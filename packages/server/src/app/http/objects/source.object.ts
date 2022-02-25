import { createUnionType } from "@nestjs/graphql";
import { DatabaseSource } from "./database-source.object";
import { VirtualSource } from "./virtual-source.object";

export const SourceObject = createUnionType({
  name: "Source",
  types: () => [DatabaseSource, VirtualSource],
});
