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

describe('Users - Delete User (e2e)', () => {
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

  it('DELETE - v1/users/:id should delete user', async () => {
    const signInResponse = await signInForTest(authService, userService, {
      userRole: 'admin',
    });

    const registeredUser = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'worker',
    };

    const res = await dbUtils.query<UserSchema>({
      text: 'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id;',
      values: [
        registeredUser.name,
        registeredUser.email,
        registeredUser.password,
        registeredUser.role,
      ],
    });

    const userId = res.rows[0].id;

    await request(app.getHttpServer())
      .delete(`/v1/users/${userId}`)
      .set('Authorization', `Bearer ${signInResponse.data.access_token}`)
      .expect(200);
  });

  it('DELETE - v1/users/:id should throw not found if it tries to delete a nonexisting user', async () => {
    const signInResponse = await signInForTest(authService, userService, {
      userRole: 'admin',
    });
    await request(app.getHttpServer())
      .delete(`/v1/users/100`)
      .set('Authorization', `Bearer ${signInResponse.data.access_token}`)
      .expect(404);
  });
});
