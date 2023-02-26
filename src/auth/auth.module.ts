import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UserService } from 'src/user/user.service';
import { LocalStrategy } from './strategies/local.strategy';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CustomJwtService } from 'src/jwt/jwt.service';
import { JwtService as JwtNestService } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [UserModule, PassportModule, JwtModule.register({})],
  providers: [
    UserService,
    AuthService,
    AuthResolver,
    CustomJwtService,
    JwtNestService,
    LocalStrategy,
    JwtStrategy,
  ],
})
export class AuthModule {}
