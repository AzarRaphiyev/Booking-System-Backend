import { Controller, Post, Body, Get } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  async createAppointment(@Body() body: {
    userId: number;
    providerId: number;
    serviceId: number;
    startTime: string;
    endTime: string;
  }) {
    return this.appointmentsService.createAppointmentByIds(
      body.userId,
      body.providerId,
      body.serviceId,
      new Date(body.startTime),
      new Date(body.endTime),
    );
  }

  @Get()
  async getAllAppointments() {
    return this.appointmentsService.findAll();
  }
}
