import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/_shared/database/database.service';
import { UserSchema } from '../users/schemas/user.schema';

@Injectable()
export class AuthRepository {
  constructor(private readonly db: DatabaseService) {}

  async findUserByEmail(email: string): Promise<UserSchema | null> {
    const res = await this.db.query<UserSchema>({
      text: 'SELECT * FROM users WHERE email = $1',
      values: [email],
    });

    if (res.rowCount === 0) {
      return null;
    }

    return res.rows[0];
  }
}
