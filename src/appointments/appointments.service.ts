import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, In } from 'typeorm';
import { Appointment, AppointmentStatus } from './entities/appointment.entity';
import { Provider } from '../providers/entities/provider.entity';
import { Service } from '../services/entities/service.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  async createAppointment(createDto: CreateAppointmentDto) {
    const { userId, providerId, serviceId, appointmentDate, startTime, endTime, totalPrice } = createDto;

    const provider = await this.providerRepository.findOne({ where: { id: providerId } });
    const service = await this.serviceRepository.findOne({ where: { id: serviceId } });

    if (!provider || !service) {
      throw new BadRequestException('Uzman veya hizmet bulunamadı');
    }

    const [startH, startM] = startTime.split(':').map(Number);
    const startDt = new Date(appointmentDate);
    startDt.setHours(startH, startM, 0, 0);

    let endDt: Date;
    if (endTime) {
      const [endH, endM] = endTime.split(':').map(Number);
      endDt = new Date(appointmentDate);
      endDt.setHours(endH, endM, 0, 0);
    } else {
      endDt = new Date(startDt.getTime() + (service.durationInMinutes || 30) * 60000);
    }

    // double booking check
    const overlapping = await this.appointmentRepository.findOne({
      where: {
        provider: { id: provider.id },
        status: In([AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED]),
        startTime: LessThan(endDt),
        endTime: MoreThan(startDt),
      },
    });

    if (overlapping) {
      throw new BadRequestException('Seçilen saat diliminde uzman zaten meşgul (Çifte rezervasyon).');
    }

    const appointment = this.appointmentRepository.create({
      userId,
      provider,
      service,
      startTime: startDt,
      endTime: endDt,
      totalPrice,
      status: AppointmentStatus.PENDING,
    });

    return this.appointmentRepository.save(appointment);
  }

  async findAll() {
    return this.appointmentRepository.find();
  }
}
