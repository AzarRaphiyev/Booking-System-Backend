import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async createService(name: string, description?: string, price?: number) {
    const service = this.serviceRepository.create({ name, description, price });
    return this.serviceRepository.save(service);
  }

  async findAll() {
    return this.serviceRepository.find();
  }

  async findById(id: number) {
    return this.serviceRepository.findOne({ where: { id } });
  }
}
