import { Injectable } from '@nestjs/common';
import { DatabaseService } from './_shared/database/database.service';

@Injectable()
export class AppService {
  constructor(private db: DatabaseService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async testDb() {
    const res = await this.db.query('SELECT 1+1 as result;');
    console.log(res.rows[0]);
  }

  async createUser() {
    const user = {
      name: 'John Doe',
      email: 'johndoe@email.com',
      password: 'password',
    };

    const res = await this.db.query({
      text: "INSERT INTO users(name, email, password) VALUES ($1,$2,$3) RETURNING id, name, email;",
      values: [user.name, user.email, user.password],
    });

    const createdUser = res.rows[0];
    return createdUser;
  }
}
