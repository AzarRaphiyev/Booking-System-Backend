import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Services')
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni hizmet ekle' })
  @ApiResponse({ status: 201, description: 'Hizmet başarıyla eklendi.' })
  async createService(@Body() createServiceDto: CreateServiceDto) {
    return this.servicesService.createService(createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Tüm hizmetleri listele' })
  @ApiResponse({ status: 200, description: 'Sistemdeki tüm hizmetlerin listesi.' })
  async getAllServices() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Belirli bir hizmeti getir' })
  @ApiResponse({ status: 200, description: 'Hizmet detayı.' })
  async getService(@Param('id') id: number) {
    return this.servicesService.findById(id);
  }
}
