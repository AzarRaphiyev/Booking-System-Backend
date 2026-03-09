import { Controller, Get, Query, ParseIntPipe, BadRequestException } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get()
  @ApiOperation({ summary: 'Belirli bir tarihte uzmanın müsait saatlerini getirir' })
  @ApiQuery({ name: 'providerId', type: Number, description: 'Uzmanın ID si' })
  @ApiQuery({ name: 'date', type: String, description: 'Tarih (YYYY-MM-DD formatında)' })
  @ApiQuery({ name: 'serviceId', type: Number, description: 'Hizmetin ID si' })
  @ApiResponse({ status: 200, description: 'Müsait saat dilimleri (["10:00", "11:30"])' })
  async getAvailability(
    @Query('providerId', ParseIntPipe) providerId: number,
    @Query('date') date: string,
    @Query('serviceId', ParseIntPipe) serviceId: number,
  ) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      throw new BadRequestException('Tarih YYYY-MM-DD formatında olmalıdır');
    }
    return this.availabilityService.getAvailableTimeSlots(providerId, date, serviceId);
  }
}
