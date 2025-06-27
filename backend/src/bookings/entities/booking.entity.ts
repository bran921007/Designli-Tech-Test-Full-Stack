import { ApiProperty } from '@nestjs/swagger';

export interface Booking {
  id: string;
  title: string;
  start: Date;
  end: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class BookingEntity {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  start: Date;

  @ApiProperty()
  end: Date;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
