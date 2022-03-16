import "source-map-support/register";

// import { startHttpServer } from "@nest-boot/common";
import { NestFactory } from "@nestjs/core";

import { HttpModule } from "./app/http/http.module";

// startHttpServer(HttpModule);

(async () => {
  const app = await NestFactory.create(HttpModule);
  app.listen(5000);
})();
