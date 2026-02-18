import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ServicesService } from './services.service';

@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  async createService(@Body() body: { name: string; description?: string; price?: number }) {
    return this.servicesService.createService(body.name, body.description, body.price);
  }

  @Get()
  async getAllServices() {
    return this.servicesService.findAll();
  }

  @Get(':id')
  async getService(@Param('id') id: number) {
    return this.servicesService.findById(id);
  }
}
