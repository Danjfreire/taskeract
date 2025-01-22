import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { DatabaseTestUtils } from 'src/_shared/test_utils/database-test.utils';
import { CREATE_TABLE_USERS } from 'src/_shared/test_utils/db_test_queries/create_table_users';
import { config } from 'dotenv';
import { AuthModule } from '../auth.module';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/v1/users/dto/create-user.dto';
import { UsersModule } from 'src/v1/users/users.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dbUtils: DatabaseTestUtils;
  let jwtService: JwtService;

  beforeAll(async () => {
    config({ path: '.env.test' });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UsersModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    jwtService = moduleRef.get<JwtService>(JwtService);

    dbUtils = new DatabaseTestUtils();
    await dbUtils.dropTable('users');
    await dbUtils.query(CREATE_TABLE_USERS);
  });

  afterEach(async () => {
    await dbUtils.truncateTable('users');
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST - v1/auth/login should login a user', async () => {
    const createUserDTO: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'worker',
    };

    await request(app.getHttpServer()).post('/v1/users').send(createUserDTO);

    const loginUserDto = {
      email: createUserDTO.email,
      password: createUserDTO.password,
    };

    const response = await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send(loginUserDto)
      .expect(201);

    expect(response.body.access_token).toBeDefined();
    // Verify the token, throws an error if it's invalid
    jwtService.verify(response.body.access_token);
  });

  it('POST - v1/auth/login should throw unauthorized exception if user credentials are wrong', async () => {
    const createUserDTO: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'worker',
    };

    await request(app.getHttpServer()).post('/v1/users').send(createUserDTO);

    const loginUserDto = {
      email: createUserDTO.email,
      password: 'someotherpassword',
    };

    await request(app.getHttpServer())
      .post('/v1/auth/login')
      .send(loginUserDto)
      .expect(401);
  });
});
