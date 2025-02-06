import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';
import {
  TASK_PRIORITIES,
  TASK_STATUSES,
  TaskPriority,
  TaskStatus,
} from '../models/task.schema';

export class UpdateTaskDto {
  @IsString()
  @IsOptional()
  public title?: string;

  @IsString()
  @IsOptional()
  public description?: string;

  @IsDateString()
  @IsOptional()
  public due_date?: string;

  @IsIn(TASK_PRIORITIES)
  @IsOptional()
  public priority?: TaskPriority;

  @IsIn(TASK_STATUSES)
  @IsOptional()
  public status?: TaskStatus;
}
