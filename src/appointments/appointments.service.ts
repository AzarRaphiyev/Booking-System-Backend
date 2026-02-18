import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { User } from '../users/entities/user.entity';
import { Provider } from '../providers/entities/provider.entity';
import { Service } from '../services/entities/service.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async createAppointmentByIds(
    userId: number,
    providerId: number,
    serviceId: number,
    startTime: Date,
    endTime: Date,
  ) {
    // fetch relational objects
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const provider = await this.providerRepository.findOne({ where: { id: providerId }, relations: ['services'] });
    const service = await this.serviceRepository.findOne({ where: { id: serviceId } });

    if (!user || !provider || !service) {
      throw new BadRequestException('Invalid user, provider, or service');
    }

    // double booking check
    const overlapping = await this.appointmentRepository.findOne({
      where: {
        provider: { id: provider.id },
        startTime: Between(startTime, endTime),
      },
    });

    if (overlapping) {
      throw new BadRequestException('This time slot is already booked.');
    }

    const appointment = this.appointmentRepository.create({
      user,
      provider,
      service,
      startTime,
      endTime,
      status: AppointmentStatus.PENDING,
    });

    return this.appointmentRepository.save(appointment);
  }

  async findAll() {
    return this.appointmentRepository.find();
  }
}
