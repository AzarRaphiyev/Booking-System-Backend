import { Controller, Get, Post, Body, Param, Query, ParseIntPipe } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

@ApiTags('Providers')
@Controller('providers')
export class ProvidersController {
  constructor(private readonly providersService: ProvidersService) {}

  @Post()
  @ApiOperation({ summary: 'Yeni uzman ekle' })
  @ApiResponse({ status: 201, description: 'Uzman başarıyla eklendi.' })
  async createProvider(@Body() createProviderDto: CreateProviderDto) {
    return this.providersService.createProvider(createProviderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Uzmanları listele' })
  @ApiResponse({ status: 200, description: 'Sistemdeki uzman listesi.' })
  @ApiQuery({ name: 'serviceId', required: false, type: Number, description: 'Hizmet ID sine göre filtrele' })
  async getAllProviders(@Query('serviceId') serviceId?: string) {
    const parsedServiceId = serviceId ? parseInt(serviceId, 10) : undefined;
    return this.providersService.findAll(parsedServiceId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Belirli bir uzmanı getir' })
  @ApiResponse({ status: 200, description: 'Uzman detayı.' })
  async getProvider(@Param('id', ParseIntPipe) id: number) {
    return this.providersService.findById(id);
  }
}
