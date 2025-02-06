import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../users.module';
import { DatabaseTestUtils } from 'src/_shared/test_utils/database-test.utils';
import { config } from 'dotenv';
import { UserSchema } from '../schemas/user.schema';
import { AuthService } from 'src/v1/auth/auth.service';
import { signInForTest } from 'src/_shared/test_utils/test-login';
import { UsersService } from '../users.service';

describe('Users - List Users (e2e)', () => {
  let app: INestApplication;
  let authService: AuthService;
  let userService: UsersService;
  let dbUtils: DatabaseTestUtils;

  beforeAll(async () => {
    config({ path: '.env.test' });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [UsersModule],
    }).compile();

    app = moduleRef.createNestApplication();
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UsersService>(UsersService);
    await app.init();

    dbUtils = new DatabaseTestUtils();
  });

  afterEach(async () => {
    await dbUtils.truncateTable('users');
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET - v1/users should return a list of users', async () => {
    const signInResponse = await signInForTest(authService, userService, {
      userRole: 'admin',
    });

    const registeredUsers = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        role: 'worker',
      },
      {
        name: 'Anna Doe',
        email: 'anna.doe@example.com',
        password: 'password123',
        role: 'worker',
      },
    ];

    for (const user of registeredUsers) {
      await dbUtils.query<UserSchema>({
        text: 'INSERT INTO users (name, email, password, role, is_active) VALUES ($1, $2, $3, $4, $5) RETURNING id;',
        values: [user.name, user.email, user.password, user.role, true],
      });
    }

    const response = await request(app.getHttpServer())
      .get(`/v1/users`)
      .set('Authorization', `Bearer ${signInResponse.data.access_token}`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.length).toBe(3); // 2 registered users + 1 admin user
    expect(response.body).toContainEqual({
      id: expect.any(Number),
      name: registeredUsers[0].name,
      email: registeredUsers[0].email,
      role: registeredUsers[0].role,
      is_active: true,
    });
    expect(response.body).toContainEqual({
      id: expect.any(Number),
      name: registeredUsers[1].name,
      email: registeredUsers[1].email,
      role: registeredUsers[1].role,
      is_active: true,
    });
  });
});
