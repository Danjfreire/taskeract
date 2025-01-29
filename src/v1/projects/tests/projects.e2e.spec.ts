import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DatabaseTestUtils } from 'src/_shared/test_utils/database-test.utils';
import { config } from 'dotenv';
import { signInForTest } from 'src/_shared/test_utils/test-login';
import { UsersService } from 'src/v1/users/users.service';
import { ProjectsModule } from '../projects.module';
import { AuthService } from 'src/v1/auth/auth.service';
import { CreateProjectDto } from '../dto/create-project.dto';
import { UsersModule } from 'src/v1/users/users.module';
import { Project } from '../models/project.model';

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

  afterEach(async () => {
    await dbUtils.truncateTable('users');
    await dbUtils.truncateTable('projects');
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST - v1/projects should register a project', async () => {
    const res = await signInForTest(authService, userService, {
      userRole: 'admin',
    });

    const date = new Date();
    const createProjectDTO: CreateProjectDto = {
      title: 'Project 1',
      description: 'Description 1',
      startDate: date.toISOString(),
    };

    const response = await request(app.getHttpServer())
      .post('/v1/projects')
      .set('Authorization', `Bearer ${res.data.access_token}`)
      .send(createProjectDTO)
      .expect(201);

    const expectedProject: Project = {
      id: expect.any(Number),
      title: 'Project 1',
      description: 'Description 1',
      startDate: date.toISOString(),
      endDate: null,
      status: 'planned',
    };

    expect(response.body).toEqual(expectedProject);
  });
});
