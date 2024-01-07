import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { AuthRepository } from '../repository/auth.repository';

@Module({
  exports: [AuthService],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository],
})
export class AuthModule {}
