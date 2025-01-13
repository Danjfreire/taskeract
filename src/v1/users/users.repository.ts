import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/_shared/database/database.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserSchema } from './schemas/user.schema';
import { User } from './models/user.model';

@Injectable()
export class UsersRepository {
  constructor(private database: DatabaseService) {}

  async createUser(createUserDto: CreateUserDto) {
    const res = await this.database.query<UserSchema>({
      text: 'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
      values: [
        createUserDto.name,
        createUserDto.email,
        createUserDto.password,
        createUserDto.role,
      ],
    });

    return this.convert(res.rows[0]);
  }

  private convert(schema: UserSchema): User {
    return {
      id: schema.id,
      name: schema.name,
      email: schema.email,
      role: schema.role,
    };
  }
}
