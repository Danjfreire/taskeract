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
}
