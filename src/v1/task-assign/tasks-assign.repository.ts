import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/_shared/database/database.service';

@Injectable()
export class TaskAssignRepository {
  constructor(private readonly db: DatabaseService) {}

  async assignTask(taskId: number, userId: number) {
    await this.db.query({
      text: ` INSERT INTO task_assignee (task_id, user_id) VALUES ($1, $2) RETURNING *`,
      values: [taskId, userId],
    });
  }

  async unassignTask(taskId: number, userId: number) {
    await this.db.query({
      text: ` DELETE FROM task_assignee WHERE task_id = $1 AND user_id = $2`,
      values: [taskId, userId],
    });
  }

  async isTaskAssignee(taskId: number, userId: number): Promise<boolean> {
    const res = await this.db.query({
      text: `SELECT * FROM task_assignee WHERE task_id = $1 AND user_id = $2`,
      values: [taskId, userId],
    });

    return res.rows.length > 0;
  }
}
