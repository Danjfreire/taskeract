import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  public readonly name: string;

  @IsEmail()
  public readonly email: string;

  @IsString()
  public readonly password: string;

  @IsOptional()
  @IsString()
  public readonly role?: string;
}
