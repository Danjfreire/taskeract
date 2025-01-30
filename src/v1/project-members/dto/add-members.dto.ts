import { IsNumber } from 'class-validator';

export class AddProjectMembersDto {
  @IsNumber({}, { each: true })
  public readonly members: number[];
}
