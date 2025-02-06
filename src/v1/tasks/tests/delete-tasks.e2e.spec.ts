import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { DatabaseTestUtils } from 'src/_shared/test_utils/database-test.utils';
import { config } from 'dotenv';
import { signInForTest } from 'src/_shared/test_utils/test-login';
import { UsersService } from 'src/v1/users/users.service';
import { AuthService } from 'src/v1/auth/auth.service';
import { UsersModule } from 'src/v1/users/users.module';
import { ProjectsService } from 'src/v1/projects/projects.service';
import { CreateProjectDto } from 'src/v1/projects/dto/create-project.dto';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TasksModule } from '../tasks.module';
import { ProjectsModule } from 'src/v1/projects/projects.module';
import { TasksService } from '../tasks.service';
import { UpdateTaskDto } from '../dto/edit-task.dto';

describe('Tasks - Delete Task(e2e)', () => {
  let app: INestApplication;
  let dbUtils: DatabaseTestUtils;
  let authService: AuthService;
  let userService: UsersService;
  let projectService: ProjectsService;
  let taskService: TasksService;

  beforeAll(async () => {
    config({ path: '.env.test' });
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [TasksModule, UsersModule, ProjectsModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    authService = moduleRef.get<AuthService>(AuthService);
    userService = moduleRef.get<UsersService>(UsersService);
    projectService = moduleRef.get<ProjectsService>(ProjectsService);
    taskService = moduleRef.get<TasksService>(TasksService);

    await app.init();

    dbUtils = new DatabaseTestUtils();
  });

  afterEach(async () => {
    await dbUtils.truncateTable('users');
    await dbUtils.truncateTable('tasks');
    await dbUtils.truncateTable('projects');
  });

  afterAll(async () => {
    await app.close();
  });

  it('DELETE - v1/projects/:id/tasks/:id should delete task', async () => {
    // SETUP
    const res = await signInForTest(authService, userService, {
      userRole: 'admin',
    });
    const date = new Date();
    const createProjectDTO: CreateProjectDto = {
      title: 'Project 1',
      description: 'Description 1',
      startDate: date.toISOString(),
    };

    const project = await projectService.createProject(createProjectDTO);

    const createTaskDTO: CreateTaskDto = {
      title: 'Task 1',
      description: 'Description 1',
      due_date: date.toISOString(),
      priority: 'low',
      status: 'pending',
    };

    const task = await taskService.createTask(project.data.id, createTaskDTO);

    // ASSERT
    await request(app.getHttpServer())
      .delete(`/v1/projects/${project.data.id}/tasks/${task.data.id}`)
      .set('Authorization', `Bearer ${res.data.access_token}`)
      .expect(200);
  });

  it('DELETE - v1/projects/:id/tasks/:id should throw error if tries to delete a task that doestn exist', async () => {
    // SETUP
    const res = await signInForTest(authService, userService, {
      userRole: 'admin',
    });
    const updateTaskDTO: UpdateTaskDto = {
      title: 'Task 1 Updated',
    };

    // ASSERT
    await request(app.getHttpServer())
      .put(`/v1/projects/100000/tasks/10000`)
      .set('Authorization', `Bearer ${res.data.access_token}`)
      .send(updateTaskDTO)
      .expect(404);
  });
});
