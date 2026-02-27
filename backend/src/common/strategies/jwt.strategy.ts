import { Injectable, Logger } from "@nestjs/common"
import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Request } from "express"

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name)

  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          this.logger.debug(`Cookies received: ${JSON.stringify(req.cookies)}`)
          if (req && req.cookies) {
            const token = req.cookies["access_token"]
            this.logger.debug(`Token found: ${token ? 'YES' : 'NO'}`)
            return token
          }
          return null
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || "your-secret-key-change-this",
    })
  }

  async validate(payload: any) {
    this.logger.debug(`JWT payload: ${JSON.stringify(payload)}`)
    return { 
      phoneNumber: payload.phoneNumber,
      userId: payload.userId,
      role: payload.role,
      sessionId: payload.sessionId,
    }
  }
}