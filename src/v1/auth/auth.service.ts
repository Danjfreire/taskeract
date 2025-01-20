import { Injectable } from '@nestjs/common';
import { AuthRepository } from './auth.repository';
import { compare } from 'bcrypt';
import { UserSchema } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async login(email: string, password: string) {
    const userSchema = await this.authRepository.findUserByEmail(email);

    if (!userSchema) {
      return {
        data: null,
        error: 'not-found',
      };
    }

    const isValid = await compare(password, userSchema.password);

    if (!isValid) {
      console.log('Invalid password');
      return {
        data: null,
        error: 'not-found',
      };
    }

    console.log(userSchema);
    console.log(password);
    // const isValid;
  }

  private async buildUserJWT(userSchema: UserSchema) {
    console.log(userSchema);
  }
}
