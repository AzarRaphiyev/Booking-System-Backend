import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateServiceDto {
  @ApiProperty({ example: 'Saç Kesimi', description: 'Sunulan hizmetin adı' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({ example: 'Erkek saç kesimi ve yıkama', description: 'Hizmet detayı' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 45, description: 'Hizmetin dakika cinsinden süresi' })
  @IsNumber()
  @Min(1)
  durationInMinutes: number;

  @ApiProperty({ example: 500, description: 'Hizmetin fiyatı' })
  @IsNumber()
  @Min(0)
  price: number;
}
