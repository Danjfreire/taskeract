import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../users.module';
import { DatabaseTestUtils } from 'src/_shared/test_utils/database-test.utils';
import { config } from 'dotenv';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserSchema } from '../schemas/user.schema';
import { CreateUserDto } from '../dto/create-user.dto';
import { AuthService } from 'src/v1/auth/auth.service';
import { signInForTest } from 'src/_shared/test_utils/test-login';
import { UsersService } from '../users.service';

describe('UsersController (e2e)', () => {
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
    // await dbUtils.dropTable('users');
    // await dbUtils.query(CREATE_TABLE_USERS);
  });

  afterEach(async () => {
    await dbUtils.truncateTable('users');
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST - v1/users should create a user', async () => {
    const signInResponse = await signInForTest(authService, userService, {
      userRole: 'admin',
    });

    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'worker',
    };

    const response = await request(app.getHttpServer())
      .post('/v1/users')
      .set('Authorization', `Bearer ${signInResponse.data.access_token}`)
      .send(createUserDto)
      .expect(201);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(createUserDto.name);
    expect(response.body.email).toBe(createUserDto.email);
    expect(response.body.role).toBe(createUserDto.role);
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

  it('PUT - v1/users/:id should update a user', async () => {
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

    const updateUserDto: UpdateUserDto = {
      name: 'John Doesnt',
    };

    const response = await request(app.getHttpServer())
      .put(`/v1/users/${userId}`)
      .set('Authorization', `Bearer ${signInResponse.data.access_token}`)
      .send(updateUserDto)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(updateUserDto.name);
    expect(response.body.email).toBe(registeredUser.email);
    expect(response.body.role).toBe(registeredUser.role);
  });

  it('PUT - v1/users/:id should deactivate a user', async () => {
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

    const updateUserDto: UpdateUserDto = {
      is_active: false,
    };

    const response = await request(app.getHttpServer())
      .put(`/v1/users/${userId}`)
      .set('Authorization', `Bearer ${signInResponse.data.access_token}`)
      .send(updateUserDto)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(registeredUser.name);
    expect(response.body.email).toBe(registeredUser.email);
    expect(response.body.role).toBe(registeredUser.role);
    expect(response.body.is_active).toBe(false);
  });

  it('PUT - v1/users/:id should throw not found if it tries to update a nonexisting user', async () => {
    const signInResponse = await signInForTest(authService, userService, {
      userRole: 'admin',
    });

    const updateUserDto: UpdateUserDto = {
      name: 'John Doesnt',
    };

    await request(app.getHttpServer())
      .put(`/v1/users/100`)
      .set('Authorization', `Bearer ${signInResponse.data.access_token}`)
      .send(updateUserDto)
      .expect(404);
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
