import { IsString, IsNotEmpty, IsNumber, IsEnum, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AppointmentStatus } from '../entities/appointment.entity';

export class CreateAppointmentDto {
  @ApiProperty({ example: 'user-123', description: 'Kullanıcı veya misafir ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 1, description: 'Hizmet ID' })
  @IsNumber()
  @IsNotEmpty()
  serviceId: number;

  @ApiProperty({ example: 2, description: 'Uzman ID' })
  @IsNumber()
  @IsNotEmpty()
  providerId: number;

  @ApiProperty({ example: '2023-10-10', description: 'Randevu tarihi (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  appointmentDate: string;

  @ApiProperty({ example: '10:00', description: 'Randevu başlangıç saati (HH:MM)' })
  @IsString()
  @IsNotEmpty()
  startTime: string;

  @ApiPropertyOptional({ example: '10:45', description: 'Randevu bitiş saati (Opsiyonel, backend hesaplayabilir)' })
  @IsString()
  @IsOptional()
  endTime?: string;

  @ApiProperty({ example: 500, description: 'Toplam ücret' })
  @IsNumber()
  @IsNotEmpty()
  totalPrice: number;
}
