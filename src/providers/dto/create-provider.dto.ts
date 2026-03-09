import { IsString, IsNotEmpty, IsOptional, IsArray, IsEmail, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class WorkHourDto {
  @ApiProperty({ example: 'Monday', description: 'Gün adı' })
  @IsString()
  @IsNotEmpty()
  day: string;

  @ApiProperty({ example: '09:00', description: 'Mesai başlangıç saati' })
  @IsString()
  @IsNotEmpty()
  start: string;

  @ApiProperty({ example: '18:00', description: 'Mesai bitiş saati' })
  @IsString()
  @IsNotEmpty()
  end: string;
}

export class CreateProviderDto {
  @ApiProperty({ example: 'Ahmet Yılmaz', description: 'Uzmanın adı' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'ahmet@example.com', description: 'E-posta' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ example: 'Saç Stilisti', description: 'Uzmanın unvanı' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ example: 'https://example.com/image.jpg', description: 'Profil fotoğrafı URL' })
  @IsString()
  @IsOptional()
  profileImageUrl?: string;

  @ApiPropertyOptional({ type: [WorkHourDto], description: 'Çalışma saatleri listesi' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => WorkHourDto)
  @IsOptional()
  workHours?: WorkHourDto[];

  @ApiPropertyOptional({ example: [1, 2], description: 'Uzmanın verebildiği hizmetlerin ID listesi' })
  @IsArray()
  @IsOptional()
  serviceIds?: number[];
}
