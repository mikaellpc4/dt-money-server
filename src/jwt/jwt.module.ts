import { Module } from '@nestjs/common';
import { CustomJwtService } from './jwt.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [CustomJwtService, JwtService],
})
export class JwtModule {}
