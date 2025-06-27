import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CalendarService } from '../calendar/calendar.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { isOverlap } from '../common/is-overlap';
import { Booking } from './entities/booking.entity';

@Injectable()
export class BookingsService {
  private readonly logger = new Logger(BookingsService.name);

  constructor(
    private prisma: PrismaService,
    private calendarService: CalendarService,
  ) {}

  async create(
    createBookingDto: CreateBookingDto,
    userId: string,
  ): Promise<Booking> {
    const start = new Date(createBookingDto.start);
    const end = new Date(createBookingDto.end);

    if (start >= end) {
      throw new BadRequestException('Start time must be before end time');
    }

    const existingBookings = (await this.prisma.booking.findMany({
      where: {
        userId,
        OR: [
          {
            start: { lte: end },
            end: { gte: start },
          },
        ],
      },
    })) as Booking[];

    for (const booking of existingBookings) {
      if (isOverlap(start, end, booking.start, booking.end)) {
        throw new BadRequestException(
          'This booking overlaps with an existing booking',
        );
      }
    }

    const calendarAvailable = await this.calendarService.checkFreeBusy(
      userId,
      start,
      end,
    );

    if (!calendarAvailable) {
      throw new BadRequestException(
        'This booking conflicts with an event in your Google Calendar',
      );
    }

    return await this.prisma.$transaction(
      async (tx) => {
        const overlapping = await tx.booking.findFirst({
          where: {
            userId,
            start: { lte: end },
            end: { gte: start },
          },
        });

        if (overlapping) {
          throw new BadRequestException(
            'This booking overlaps with an existing booking',
          );
        }

        return await tx.booking.create({
          data: {
            title: createBookingDto.title,
            start,
            end,
            userId,
          },
        });
      },
      {
        isolationLevel: 'Serializable',
      },
    );
  }

  async findAll(userId: string): Promise<Booking[]> {
    return (await this.prisma.booking.findMany({
      where: { userId },
      orderBy: { start: 'asc' },
    })) as Booking[];
  }

  async findOne(id: string, userId: string): Promise<Booking> {
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
    });

    if (!booking) {
      throw new BadRequestException('Booking not found');
    }

    return booking;
  }

  async remove(id: string, userId: string): Promise<Booking> {
    const booking = await this.findOne(id, userId);

    return await this.prisma.booking.delete({
      where: { id: booking.id },
    });
  }
}
