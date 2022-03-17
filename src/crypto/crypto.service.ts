import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  createCipheriv,
  createDecipheriv,
  Encoding,
  randomBytes,
  scryptSync,
} from "crypto";

@Injectable()
export class CryptoService {
  private readonly appKey: string;

  private readonly algorithm = "aes-256-gcm";

  private readonly encoding: Encoding = "base64";

  private readonly keyByteLength: number = 32;

  private readonly saltByteLength: number = 16;

  private readonly viByteLength: number = 16;

  constructor(private readonly configService: ConfigService) {
    this.appKey = this.configService.get("APP_KEY", "secret");
  }

  encrypt(value: string): string {
    const { key, salt } = this.getKeyAndSalt();
    const iv = randomBytes(this.viByteLength);

    const cipher = createCipheriv(this.algorithm, key, iv);

    const data = Buffer.concat([cipher.update(value), cipher.final()]);
    const tag = cipher.getAuthTag();

    return Buffer.from(
      JSON.stringify({
        iv: iv.toString(this.encoding),
        tag: tag.toString(this.encoding),
        data: data.toString(this.encoding),
        ...(salt ? { salt: salt.toString(this.encoding) } : {}),
      })
    ).toString(this.encoding);
  }

  decrypt(value: string): string {
    const payload = JSON.parse(
      Buffer.from(value, this.encoding).toString("utf8")
    );

    const key = payload.salt
      ? scryptSync(
          this.appKey,
          Buffer.from(payload.salt, this.encoding),
          this.keyByteLength
        )
      : Buffer.from(this.appKey, "hex");

    const iv = Buffer.from(payload.iv, this.encoding);
    const tag = Buffer.from(payload.tag, this.encoding);
    const data = Buffer.from(payload.data, this.encoding);

    const decipher = createDecipheriv(this.algorithm, key, iv);

    decipher.setAuthTag(tag);

    return Buffer.concat([decipher.update(data), decipher.final()]).toString(
      "utf8"
    );
  }

  private getKeyAndSalt(): { key: Buffer; salt?: Buffer } {
    const key = Buffer.from(this.appKey, "hex");

    if (key.byteLength === this.keyByteLength) {
      return { key };
    }

    const salt = randomBytes(this.saltByteLength);

    return { key: scryptSync(this.appKey, salt, this.keyByteLength), salt };
  }
}
