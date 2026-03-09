import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from './entities/provider.entity';
import { Service } from '../services/entities/service.entity';
import { CreateProviderDto } from './dto/create-provider.dto';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async createProvider(createProviderDto: CreateProviderDto): Promise<Provider> {
    const { serviceIds, ...providerData } = createProviderDto;

    let services: Service[] = [];
    if (serviceIds && serviceIds.length > 0) {
      services = await this.serviceRepository.findByIds(serviceIds);
    }

    const provider = this.providerRepository.create({
      ...providerData,
      services,
    });
    return this.providerRepository.save(provider);
  }

  async findAll(serviceId?: number): Promise<Provider[]> {
    if (serviceId) {
      return this.providerRepository.find({
        where: {
          services: {
            id: serviceId,
          },
        },
        relations: ['services'],
      });
    }
    return this.providerRepository.find({ relations: ['services'] });
  }

  async findById(id: number): Promise<Provider> {
    const provider = await this.providerRepository.findOne({ where: { id }, relations: ['services'] });
    if (!provider) {
      throw new NotFoundException(`Provider with id ${id} not found`);
    }
    return provider;
  }
}
