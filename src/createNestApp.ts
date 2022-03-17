import { NestFactory } from "@nestjs/core";

import { HttpModule } from "./app/http/http.module";

declare const module: any;

export const createNestApp = async () => {
  const app = await NestFactory.create(HttpModule);

  await app.init();

  return app;
};
