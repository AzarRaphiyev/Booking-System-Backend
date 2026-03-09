import { Controller, Post, Body, Get } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni randevu oluştur' })
  @ApiResponse({ status: 201, description: 'Randevu başarıyla oluşturuldu.' })
  @ApiResponse({ status: 400, description: 'Hatalı istek veya çifte rezervasyon.' })
  async createAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.createAppointment(createAppointmentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm randevuları listele' })
  async getAllAppointments() {
    return this.appointmentsService.findAll();
  }
}
