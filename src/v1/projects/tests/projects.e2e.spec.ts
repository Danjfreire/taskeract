import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DatabaseTestUtils } from 'src/_shared/test_utils/database-test.utils';
import { config } from 'dotenv';
import { CreateUserDto } from 'src/v1/users/dto/create-user.dto';
import { signInForTest } from 'src/_shared/test_utils/test-login';
import { UsersService } from 'src/v1/users/users.service';
import { ProjectsModule } from '../projects.module';
import { AuthService } from 'src/v1/auth/auth.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UsersModule } from 'src/v1/users/users.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let dbUtils: DatabaseTestUtils;
  let authService: AuthService;
  let userService: UsersService;

  beforeAll(async () => {
    config({ path: '.env.test' });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [ProjectsModule, UsersModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UsersService>(UsersService);
    await app.init();

    dbUtils = new DatabaseTestUtils();
  });

  afterEach(async () => {});

  afterAll(async () => {
    await app.close();
  });

  it('POST - v1/projects should register a project', async () => {
    const createProjectDTO = {
      title: 'Project 1',
      description: 'Description 1',
      startDate: new Date().toISOString(),
    };

    console.log(createProjectDTO);

    const response = await request(app.getHttpServer())
      .post('/v1/projects')
      .send(createProjectDTO);

    console.log('Response: ', response.body);

    expect(response.body).toBeDefined();
  });
});
