import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UsersModule } from '../users.module';
import { DatabaseTestUtils } from 'src/_shared/test_utils/database-test.utils';
import { CREATE_TABLE_USERS } from 'src/_shared/test_utils/db_test_queries/create_table_users';
import { config } from 'dotenv';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserSchema } from '../schemas/user.schema';
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

  beforeEach(async () => {
    await dbUtils.truncateTable('users');
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST - v1/users should create a user', async () => {
    const createUserDto: CreateUserDto = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'worker',
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

  it('GET - v1/users should return a list ofuser', async () => {
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
        text: 'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id;',
        values: [user.name, user.email, user.password, user.role],
      });
    }

    const response = await request(app.getHttpServer())
      .get(`/v1/users`)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.length).toBe(2);
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
      .send(updateUserDto)
      .expect(200);

    expect(response.body).toBeDefined();
    expect(response.body.id).toBeDefined();
    expect(response.body.name).toBe(updateUserDto.name);
    expect(response.body.email).toBe(registeredUser.email);
    expect(response.body.role).toBe(registeredUser.role);
  });

  it('PUT - v1/users/:id should throw not found if it tries to update a nonexisting user', async () => {
    const updateUserDto: UpdateUserDto = {
      name: 'John Doesnt',
    };

    await request(app.getHttpServer())
      .put(`/v1/users/100`)
      .send(updateUserDto)
      .expect(404);
  });
});
