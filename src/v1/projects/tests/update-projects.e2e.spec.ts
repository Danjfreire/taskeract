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
import { UpdateProjectDto } from '../dto/update-project.dto';
import { ProjectsService } from '../projects.service';

describe('Projects - Update Project(e2e)', () => {
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

  it('PUT - v1/projects/:id should throw error if it tries to update a project that doesnt exist', async () => {
    const res = await signInForTest(authService, userService, {
      userRole: 'admin',
    });

    const updateProjectDTO: UpdateProjectDto = {
      title: 'Project 1',
      description: 'Description 1',
    };

    await request(app.getHttpServer())
      .put('/v1/projects/1')
      .set('Authorization', `Bearer ${res.data.access_token}`)
      .send(updateProjectDTO)
      .expect(404);
  });

  it('PUT - v1/projects/:id should update a project', async () => {
    const auth = await signInForTest(authService, userService, {
      userRole: 'admin',
    });

    const registeredProject: CreateProjectDto = {
      title: 'Project 1',
      description: 'Description 1',
      startDate: new Date().toISOString(),
    };

    const project = await projectService.createProject(registeredProject);

    const updateProjectDTO: UpdateProjectDto = {
      title: 'Project 2',
      description: 'Description 2',
      status: 'ongoing',
    };

    const res = await request(app.getHttpServer())
      .put(`/v1/projects/${project.data.id}`)
      .set('Authorization', `Bearer ${auth.data.access_token}`)
      .send(updateProjectDTO)
      .expect(200);

    expect(res.body.title).toBe('Project 2');
    expect(res.body.description).toBe('Description 2');
  });
});
