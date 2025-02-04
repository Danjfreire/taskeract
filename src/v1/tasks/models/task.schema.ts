export const TASK_STATUSES = ['pending', 'in-progress', 'completed'] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const TASK_PRIORITIES = ['low', 'medium', 'high'] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface TaskSchema {
  id: number;
  title: string;
  description: string | null;
  due_date: Date | null;
  project_id: number;
  priority: TaskPriority;
  status: TaskStatus;
  created_at: Date;
}
