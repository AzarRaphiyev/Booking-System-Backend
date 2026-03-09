import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProvidersService } from './providers.service';
import { ProvidersController } from './providers.controller';
import { Provider } from './entities/provider.entity';
import { Service } from '../services/entities/service.entity'; // <-- Bunu import et

@Module({
  // TypeOrmModule.forFeature daxilinə Service-i də əlavə edirik:
  imports: [TypeOrmModule.forFeature([Provider, Service])], 
  controllers: [ProvidersController],
  providers: [ProvidersService],
  exports: [ProvidersService, TypeOrmModule],
})
export class ProvidersModule {}