import { Module } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CalendarModule } from '../calendar/calendar.module';

@Module({
  imports: [PrismaModule, CalendarModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
