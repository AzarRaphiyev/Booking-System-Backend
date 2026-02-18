import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Provider } from './entities/provider.entity';
import { Service } from '../services/entities/service.entity';

@Injectable()
export class ProvidersService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
  ) {}

  async createProvider(
    name: string,
    email: string,
    workHours?: { day: string; start: string; end: string }[],
    services?: Service[],
  ) {
    const provider = this.providerRepository.create({ name, email, workHours, services });
    return this.providerRepository.save(provider);
  }

  async findAll() {
    return this.providerRepository.find({ relations: ['services'] });
  }

  async findById(id: number) {
    return this.providerRepository.findOne({ where: { id }, relations: ['services'] });
  }

  
}
