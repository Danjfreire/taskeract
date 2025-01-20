import { IsEmail, IsOptional, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public readonly name: string;

  @IsEmail()
  public readonly email: string;

  @IsString()
  @Length(6)
  public readonly password: string;

  @IsOptional()
  @IsString()
  public readonly role?: string;
}
