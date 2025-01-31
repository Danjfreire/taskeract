import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';
import { PROJECT_STATUSES, ProjectStatus } from '../models/project.model';

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  public readonly title?: string;

  @IsOptional()
  @IsString()
  public readonly description?: string;

  @IsOptional()
  @IsDateString()
  public readonly startDate?: string;

  @IsOptional()
  @IsDateString()
  public readonly endDate?: string;

  @IsOptional()
  @IsIn(PROJECT_STATUSES)
  public readonly status?: ProjectStatus;
}
