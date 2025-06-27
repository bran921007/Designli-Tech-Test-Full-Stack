import { Module } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [CalendarService],
  exports: [CalendarService],
})
export class CalendarModule {}
