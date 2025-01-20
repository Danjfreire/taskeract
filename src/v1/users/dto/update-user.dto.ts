import { IsBoolean, IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  public readonly name?: string;

  @IsOptional()
  @IsEmail()
  public readonly email?: string;

  @IsOptional()
  @IsString()
  public readonly password?: string;

  @IsOptional()
  @IsString()
  public readonly role?: string;

  @IsOptional()
  @IsBoolean()
  public readonly is_active?: boolean;
}
