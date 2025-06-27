import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { BookingEntity } from './entities/booking.entity';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

interface User {
  id: string;
  email: string;
  name: string;
}

@ApiTags('bookings')
@Controller('bookings')
@ApiBearerAuth()
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new booking' })
  @ApiResponse({
    status: 201,
    description: 'The booking has been successfully created.',
    type: BookingEntity,
  })
  @ApiResponse({
    status: 400,
    description: 'Bad request or overlapping booking.',
  })
  create(
    @Body() createBookingDto: CreateBookingDto,
    @CurrentUser() user: User,
  ) {
    return this.bookingsService.create(createBookingDto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'Get all bookings for the current user' })
  @ApiResponse({
    status: 200,
    description: 'List of bookings.',
    type: [BookingEntity],
  })
  findAll(@CurrentUser() user: User) {
    return this.bookingsService.findAll(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific booking' })
  @ApiResponse({
    status: 200,
    description: 'The booking.',
    type: BookingEntity,
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.findOne(id, user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a booking' })
  @ApiResponse({
    status: 200,
    description: 'The booking has been successfully deleted.',
    type: BookingEntity,
  })
  @ApiResponse({ status: 404, description: 'Booking not found.' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.bookingsService.remove(id, user.id);
  }
}
