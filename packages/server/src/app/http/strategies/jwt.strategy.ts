import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";

import { User } from "../../core/entities/user.entity";
import { UserService } from "../../core/services/user.service";

@Injectable()
export class JwtPassportStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UserService
  ) {
    super({
      jwtFromRequest: (req: Request) => req?.cookies?.session_token,
      ignoreExpiration: false,
      secretOrKey: configService.get("JWT_SECRET", "secret"),
    });
  }

  async validate({
    name,
    email,
    picture: avatar,
  }: {
    name: string;
    email: string;
    picture: string;
  }): Promise<User> {
    const user =
      (await this.userService.findOne({ where: { email } })) ||
      (await this.userService.create({ name, email, avatar }));

    return user;
  }
}
