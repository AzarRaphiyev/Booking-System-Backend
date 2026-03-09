import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Provider } from '../providers/entities/provider.entity';
import { Service } from '../services/entities/service.entity';
import { Appointment, AppointmentStatus } from '../appointments/entities/appointment.entity';

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectRepository(Provider)
    private readonly providerRepository: Repository<Provider>,
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async getAvailableTimeSlots(providerId: number, dateStr: string, serviceId: number): Promise<string[]> {
    const provider = await this.providerRepository.findOne({ where: { id: providerId } });
    if (!provider) throw new NotFoundException('Provider not found');

    const service = await this.serviceRepository.findOne({ where: { id: serviceId } });
    if (!service) throw new NotFoundException('Service not found');

    const duration = service.durationInMinutes || 30;
    
    // Determine the day of the week
    const date = new Date(dateStr);
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayOfWeek = days[date.getDay()];

    const workHours = provider.workHours?.find((wh) => wh.day.toLowerCase() === dayOfWeek.toLowerCase());
    
    // If provider does not work on this day
    if (!workHours) return [];

    const [startHour, startMin] = workHours.start.split(':').map(Number);
    const [endHour, endMin] = workHours.end.split(':').map(Number);

    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    // Get appointments
    const appointments = await this.appointmentRepository.find({
      where: {
        provider: { id: providerId },
        startTime: Between(startOfDay, endOfDay),
        status: In([AppointmentStatus.CONFIRMED, AppointmentStatus.PENDING]), // Block pending and confirmed
      },
    });

    const availableSlots: string[] = [];
    
    // We step roughly every 30 minutes, or we could step by duration. We'll step by 30 mins as it's typical.
    // Or we step by duration minimum. Let's do 30 mins steps for slots.
    const stepInMinutes = 30;

    let currentHour = startHour;
    let currentMin = startMin;

    while (currentHour < endHour || (currentHour === endHour && currentMin + duration <= endMin)) {
      const slotStart = new Date(date);
      slotStart.setHours(currentHour, currentMin, 0, 0);

      const slotEnd = new Date(slotStart.getTime() + duration * 60000); // add duration

      // Check if slotEnd exceeds work hours
      const workEndTime = new Date(date);
      workEndTime.setHours(endHour, endMin, 0, 0);
      
      if (slotEnd > workEndTime) {
        break; 
      }

      // Check overlaps
      const isOverlapping = appointments.some((appt) => {
        const apptStart = appt.startTime.getTime();
        const apptEnd = appt.endTime.getTime();
        const sStart = slotStart.getTime();
        const sEnd = slotEnd.getTime();

        return (sStart < apptEnd && sEnd > apptStart);
      });

      if (!isOverlapping) {
        const hh = String(slotStart.getHours()).padStart(2, '0');
        const mm = String(slotStart.getMinutes()).padStart(2, '0');
        availableSlots.push(`${hh}:${mm}`);
      }

      // Increment
      currentMin += stepInMinutes;
      if (currentMin >= 60) {
        currentHour += Math.floor(currentMin / 60);
        currentMin %= 60;
      }
    }

    return availableSlots;
  }
}
