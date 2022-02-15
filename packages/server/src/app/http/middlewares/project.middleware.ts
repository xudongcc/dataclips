import { Context } from "@nest-boot/common";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class ProjectMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: () => void): Promise<void> {
    // 获取运行上下文
    const ctx = Context.get();

    const urlMatched = req.originalUrl.match(/^\/projects\/(\d+)/);

    if (urlMatched?.[1]) {
      ctx.tenantId = urlMatched[1];
    } else if (typeof req.headers["x-project-id"] === "string") {
      ctx.tenantId = req.headers["x-project-id"];
    }

    return next();
  }
}
