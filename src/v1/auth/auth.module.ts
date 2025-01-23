import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { AuthRepository } from './auth.repository';
import { DatabaseModule } from 'src/_shared/database/database.module';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, AuthGuard],
  exports: [AuthGuard],
})
export class AuthModule {}
