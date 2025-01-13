import { Injectable } from '@nestjs/common';
import { Client, QueryConfig, QueryResult } from 'pg';

@Injectable()
export class DatabaseService {
  public async query<T>(query: string | QueryConfig): Promise<QueryResult<T>> {
    const dbClient = await this.getNewClient();

    try {
      const result = await dbClient.query(query);
      return result;
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await dbClient.end();
    }
  }

  private async getNewClient(): Promise<Client> {
    const client = new Client({
      host: process.env.POSTGRES_HOST,
      user: process.env.POSTGRES_USER,
      port: +process.env.POSTGRES_PORT,
      database: process.env.POSTGRES_DB,
      password: process.env.POSTGRES_PASSWORD,
    });

    await client.connect();

    return client;
  }
}
