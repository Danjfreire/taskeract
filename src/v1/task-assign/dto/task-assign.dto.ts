import { IsNumber } from 'class-validator';

export class TaskAssignDto {
  @IsNumber()
  user_id: number;
}
