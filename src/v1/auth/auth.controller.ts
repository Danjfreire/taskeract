import { Body, Controller, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginDto) {
    const res = await this.authService.login(body.email, body.password);

    if (res.data == null && res.error != null) {
      throw new UnauthorizedException('invalid-credentials');
    }

    return res.data;
  }
}
