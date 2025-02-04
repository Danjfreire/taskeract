import { TaskPriority, TaskStatus } from './task.schema';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  project_id: number;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: string;
}
