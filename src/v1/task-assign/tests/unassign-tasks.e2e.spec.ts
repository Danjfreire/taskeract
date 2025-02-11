import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DatabaseTestUtils } from 'src/_shared/test_utils/database-test.utils';
import { config } from 'dotenv';
import { signInForTest } from 'src/_shared/test_utils/test-login';
import { UsersService } from 'src/v1/users/users.service';
import { AuthService } from 'src/v1/auth/auth.service';
import { UsersModule } from 'src/v1/users/users.module';
import { TaskAssignModule } from '../task-assign.module';
import { ProjectMembersService } from 'src/v1/project-members/project-members.service';
import { ProjectsService } from 'src/v1/projects/projects.service';
import { ProjectsModule } from 'src/v1/projects/projects.module';
import { TasksService } from 'src/v1/tasks/tasks.service';
import { TasksModule } from 'src/v1/tasks/tasks.module';
import { TaskAssignService } from '../task-assign.service';

describe('TaskAssign - Unassign Tasks(e2e)', () => {
  let app: INestApplication;
  let dbUtils: DatabaseTestUtils;
  let authService: AuthService;
  let userService: UsersService;
  let projectService: ProjectsService;
  let taskService: TasksService;
  let taskAssignService: TaskAssignService;
  let projectMemberService: ProjectMembersService;

  beforeAll(async () => {
    config({ path: '.env.test' });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [TaskAssignModule, UsersModule, ProjectsModule, TasksModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UsersService>(UsersService);
    projectMemberService = moduleRef.get<ProjectMembersService>(
      ProjectMembersService,
    );
    projectService = moduleRef.get<ProjectsService>(ProjectsService);
    taskService = moduleRef.get<TasksService>(TasksService);
    taskAssignService = moduleRef.get<TaskAssignService>(TaskAssignService);

    await app.init();

    dbUtils = new DatabaseTestUtils();
  });

  afterEach(async () => {
    await dbUtils.truncateDatabase();
  });

  afterAll(async () => {
    await app.close();
  });

  it('DELETE - v1/projects/:id/tasks/:id/assign/:userId should unassign project member from task', async () => {
    // SETUP
    const admin = await signInForTest(authService, userService, {
      userRole: 'admin',
    });

    const worker = await signInForTest(authService, userService, {
      userRole: 'worker',
      email: 'someemail@email.com',
    });

    const date = new Date();

    const project = await projectService.createProject({
      title: 'Project 1',
      description: 'Description 1',
      startDate: date.toISOString(),
    });

    await projectMemberService.addMembersToProject(project.data.id, [
      worker.data.id,
    ]);

    const task = await taskService.createTask(project.data.id, {
      title: 'Task 1',
      description: 'Description 1',
      due_date: date.toISOString(),
      priority: 'low',
      status: 'pending',
    });

    await taskAssignService.assignTask(
      project.data.id,
      task.data.id,
      worker.data.id,
    );

    // ASSERT
    await request(app.getHttpServer())
      .delete(
        `/v1/projects/${project.data.id}/tasks/${task.data.id}/assign/${worker.data.id}`,
      )
      .set('Authorization', `Bearer ${admin.data.access_token}`)
      .expect(200);
  });
});
