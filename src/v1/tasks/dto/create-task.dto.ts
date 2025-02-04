import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  TaskPriority,
  TaskStatus,
} from '../models/task.schema';

export class CreateTaskDto {
  @IsString()
  public readonly title: string;

  @IsString()
  @IsOptional()
  public readonly description?: string;

  @IsDateString()
  @IsOptional()
  public readonly due_date?: string;

  @IsNumber()
  public readonly project_id: number;

  @IsIn(TASK_PRIORITIES)
  public readonly priority: TaskPriority;

  @IsIn(TASK_STATUSES)
  public readonly status: TaskStatus;
}
