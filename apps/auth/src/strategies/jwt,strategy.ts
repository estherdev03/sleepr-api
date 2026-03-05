import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { TokenPayload } from '../interfaces/token-payload.interface';
import { Logger } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  private readonly logger = new Logger(JwtStrategy.name);
  constructor(
    configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any): any =>
          request?.cookies?.Authentication || request?.Authentication,
      ]),
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate({ userId }: TokenPayload) {
    this.logger.log(`Validating user ${userId}`);
    return this.usersService.getUser({ _id: userId });
  }
}
