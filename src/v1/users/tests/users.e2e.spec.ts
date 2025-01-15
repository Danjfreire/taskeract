import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../users.module';
import { DatabaseTestUtils } from 'src/_shared/test_utils/database-test.utils';
import { CREATE_TABLE_USERS } from 'src/_shared/test_utils/db_test_queries/create_table_users';
import { config } from 'dotenv';
import { CreateUserDto } from '../dto/create-user.dto';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let dbUtils: DatabaseTestUtils;

  beforeAll(async () => {
    config({ path: '.env.development' });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    dbUtils = new DatabaseTestUtils();
    await dbUtils.query(CREATE_TABLE_USERS);
  });

  afterEach(async () => {
    await dbUtils.truncateTable('users');
  });

  afterAll(async () => {
    await dbUtils.dropTable('users');
    await app.close();
  });

  it('POST - v1/users should create a user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'user',
    };

    const response = await request(app.getHttpServer())
      .post('/v1/users')
      .send(createUserDto)
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(createUserDto.name);
    expect(response.body.email).toBe(createUserDto.email);
    expect(response.body.role).toBe(createUserDto.role);
  });
});
