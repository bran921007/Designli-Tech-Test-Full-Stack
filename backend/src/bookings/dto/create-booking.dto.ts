import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ description: 'Title of the booking' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ description: 'Start date and time of the booking' })
  @IsDateString()
  start: string;

  @ApiProperty({ description: 'End date and time of the booking' })
  @IsDateString()
  end: string;
}
