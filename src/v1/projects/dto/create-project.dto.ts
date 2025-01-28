import { IsDateString, IsString } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  public readonly title: string;

  @IsString()
  public readonly description: string;

  @IsDateString()
  public readonly startDate: string;
}
