import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DatabaseTestUtils } from 'src/_shared/test_utils/database-test.utils';
import { config } from 'dotenv';
import { signInForTest } from 'src/_shared/test_utils/test-login';
import { UsersService } from 'src/v1/users/users.service';
import { AuthService } from 'src/v1/auth/auth.service';
import { UsersModule } from 'src/v1/users/users.module';
import { ProjectMembersModule } from '../project-members.module';
import { AddProjectMembersDto } from '../dto/add-members.dto';
import { TABLES } from 'src/_shared/test_utils/table-names';
import { ProjectsService } from 'src/v1/projects/projects.service';
import { ProjectsModule } from 'src/v1/projects/projects.module';

describe('ProjectMembers (e2e)', () => {
  let app: INestApplication;
  let dbUtils: DatabaseTestUtils;
  let authService: AuthService;
  let usersService: UsersService;
  let projectService: ProjectsService;

  beforeAll(async () => {
    config({ path: '.env.test' });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [ProjectMembersModule, ProjectsModule, UsersModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    authService = moduleRef.get<AuthService>(AuthService);
    usersService = moduleRef.get<UsersService>(UsersService);
    projectService = moduleRef.get<ProjectsService>(ProjectsService);
    await app.init();

    dbUtils = new DatabaseTestUtils();
  });

  afterEach(async () => {
    await dbUtils.truncateTable(TABLES.users);
    await dbUtils.truncateTable(TABLES.projects);
    await dbUtils.truncateTable(TABLES.projectMembers);
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST - v1/projects should throw unprocessable entity if tries to add inexistent members to an inexistent project', async () => {
    // SETUP
    const res = await signInForTest(authService, usersService, {
      userRole: 'admin',
    });

    const addProjetMemberDto: AddProjectMembersDto = {
      members: [2, 3],
    };

    // ASSERT
    await request(app.getHttpServer())
      .post('/v1/projects/1/members')
      .set('Authorization', `Bearer ${res.data.access_token}`)
      .send(addProjetMemberDto)
      .expect(422);
  });

  it('POST - v1/projects should add members to a project', async () => {
    // SETUP
    const res = await signInForTest(authService, usersService, {
      userRole: 'admin',
    });

    const project = await projectService.createProject({
      description: 'test',
      title: 'test',
      startDate: new Date().toISOString(),
    });

    const user = await usersService.createUser({
      email: 'user@email.com',
      name: 'user',
      password: 'password',
      role: 'worker',
    });

    const addProjetMemberDto: AddProjectMembersDto = {
      members: [user.id],
    };

    // ASSERT
    await request(app.getHttpServer())
      .post(`/v1/projects/${project.data.id}/members`)
      .set('Authorization', `Bearer ${res.data.access_token}`)
      .send(addProjetMemberDto)
      .expect(201);
  });
});
