import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/_shared/database/database.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './models/task.model';
import { TaskSchema } from './models/task.schema';
import { UpdateTaskDto } from './dto/edit-task.dto';

@Injectable()
export class TaskRepository {
  constructor(private readonly db: DatabaseService) {}

  async findTask(taskId: number): Promise<Task | null> {
    const res = await this.db.query<TaskSchema>({
      text: `SELECT * FROM tasks WHERE tasks.id = $1`,
      values: [taskId],
    });

    if (res.rowCount === 0) {
      return null;
    }

    return this.convert(res.rows[0]);
  }

  async createTask(projectId: number, dto: CreateTaskDto) {
    const res = await this.db.query<TaskSchema>({
      text: `INSERT INTO tasks (title, description, due_date, project_id, priority, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      values: [
        dto.title,
        dto.description ?? null,
        dto.due_date ?? null,
        projectId,
        dto.priority,
        dto.status,
      ],
    });

    return this.convert(res.rows[0]);
  }

  async updateTask(taskId: number, dto: UpdateTaskDto) {
    const res = await this.db.query<TaskSchema>({
      text: `UPDATE tasks SET 
      title = $1, 
      description = $2, 
      due_date = $3, 
      priority = $4, 
      status = $5 
      WHERE id = $6 RETURNING *`,
      values: [
        dto.title,
        dto.description ?? null,
        dto.due_date ?? null,
        dto.priority,
        dto.status,
        taskId,
      ],
    });

    return this.convert(res.rows[0]);
  }

  async deleteTask(id: number): Promise<void> {
    await this.db.query({
      text: 'DELETE FROM tasks WHERE id = $1',
      values: [id],
    });
  }

  private convert(schema: TaskSchema): Task {
    return {
      id: schema.id,
      title: schema.title,
      description: schema.description,
      due_date: schema.due_date ? schema.due_date.toISOString() : null,
      project_id: schema.project_id,
      priority: schema.priority,
      status: schema.status,
      created_at: schema.created_at ? schema.created_at.toISOString() : null,
    };
  }
}
