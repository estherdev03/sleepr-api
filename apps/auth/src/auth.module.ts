import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { LoggerModule } from '@app/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import Joi from 'joi';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt,strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/auth/.env',
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
        HTTP_PORT: Joi.number().required(),
        TCP_PORT: Joi.number().required(),
      }),
    }),
    UsersModule,
    LoggerModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        const expiration = Number(configService.get('JWT_EXPIRATION')) || 3600;
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: expiration,
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
