import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ description: 'İstifadəçinin tam adı', example: 'Əli Məmmədov' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'İstifadəçinin e-poçt ünvanı', example: 'nmunebey@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'İstifadəçinin şifrəsi (minimum 6 simvol)', example: '123456' })
  @IsString()
  @MinLength(6)
  password: string;
}
