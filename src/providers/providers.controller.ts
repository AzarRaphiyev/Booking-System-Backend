import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { Service } from '../services/entities/service.entity';

@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  async createProvider(@Body() body: { 
    name: string; 
    email: string; 
    workHours?: { day: string; start: string; end: string }[]; 
    services?: Service[];
  }) {
    return this.providersService.createProvider(body.name, body.email, body.workHours, body.services);
  }

  @Get()
  async getAllProviders() {
    return this.providersService.findAll();
  }

  @Get(':id')
  async getProvider(@Param('id') id: number) {
    return this.providersService.findById(id);
  }
}
