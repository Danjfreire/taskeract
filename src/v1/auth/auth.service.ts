import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { compare } from 'bcrypt';
import { UserSchema } from '../users/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { Result } from 'src/_shared/utils/result';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async login(
    email: string,
    password: string,
  ): Promise<Result<{ access_token: string }>> {
    const userSchema = await this.authRepository.findUserByEmail(email);

    if (!userSchema) {
      return {
        data: null,
        error: 'not-found',
      };
    }

    const isValid = await compare(password, userSchema.password);

    if (!isValid) {
      return {
        data: null,
        error: 'not-found',
      };
    }

    const token = await this.buildUserJWT(userSchema);

    return {
      data: { access_token: token },
      error: null,
    };
  }

  private async buildUserJWT(userSchema: UserSchema) {
    const payload = {
      sub: userSchema.id,
      email: userSchema.email,
      role: userSchema.role,
    };

    const token = await this.jwtService.signAsync(payload);

    return token;
  }
}
