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
import { ProjectsService } from '../projects.service';

describe('Projects- Delete project(e2e)', () => {
  let app: INestApplication;
  let dbUtils: DatabaseTestUtils;
  let authService: AuthService;
  let userService: UsersService;
  let projectService: ProjectsService;

  beforeAll(async () => {
    config({ path: '.env.test' });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [ProjectsModule, UsersModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UsersService>(UsersService);
    projectService = moduleRef.get<ProjectsService>(ProjectsService);
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

  it('DELETE - v1/projects/:id should delete a project', async () => {
    const auth = await signInForTest(authService, userService, {
      userRole: 'admin',
    });

    const registeredProject: CreateProjectDto = {
      title: 'Project 1',
      description: 'Description 1',
      startDate: new Date().toISOString(),
    };

    const project = await projectService.createProject(registeredProject);

    await request(app.getHttpServer())
      .delete(`/v1/projects/${project.data.id}`)
      .set('Authorization', `Bearer ${auth.data.access_token}`)
      .expect(200);
  });

  it('DELETE - v1/projects/:id should throw an error if project doesnt exist', async () => {
    const auth = await signInForTest(authService, userService, {
      userRole: 'admin',
    });

    await request(app.getHttpServer())
      .delete(`/v1/projects/2`)
      .set('Authorization', `Bearer ${auth.data.access_token}`)
      .expect(404);
  });
});
