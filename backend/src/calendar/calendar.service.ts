import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import { UsersService } from '../users/users.service';

export interface FreeBusyRequest {
  timeMin: string;
  timeMax: string;
  items: { id: string }[];
}

export interface FreeBusyResponse {
  calendars: {
    [calendarId: string]: {
      busy: Array<{
        start: string;
        end: string;
      }>;
    };
  };
}

@Injectable()
export class CalendarService {
  private readonly logger = new Logger(CalendarService.name);

  constructor(private usersService: UsersService) {}

  private async getCalendarClient(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user || !user.oauthAccounts.length) {
      throw new Error('User not found or no OAuth account');
    }

    const googleAccount = user.oauthAccounts.find(
      (account) => account.provider === 'google',
    );
    if (!googleAccount) {
      throw new Error('Google OAuth account not found');
    }

    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({
      access_token: googleAccount.accessToken,
      refresh_token: googleAccount.refreshToken,
    });

    return google.calendar({ version: 'v3', auth: oauth2Client });
  }

  async checkFreeBusy(
    userId: string,
    startTime: Date,
    endTime: Date,
    calendarId = 'primary',
  ): Promise<boolean> {
    try {
      const calendar = await this.getCalendarClient(userId);

      const freeBusyRequest: FreeBusyRequest = {
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        items: [{ id: calendarId }],
      };

      const response = await calendar.freebusy.query({
        requestBody: freeBusyRequest,
      });

      const busyTimes = response.data.calendars?.[calendarId]?.busy || [];

      for (const busyTime of busyTimes) {
        if (!busyTime.start || !busyTime.end) continue;
        const busyStart = new Date(busyTime.start);
        const busyEnd = new Date(busyTime.end);

        if (startTime < busyEnd && endTime > busyStart) {
          return false;
        }
      }

      return true;
    } catch (error) {
      this.logger.error('Error checking calendar free/busy:', error);
      return true;
    }
  }

  async getUserCalendars(userId: string) {
    try {
      const calendar = await this.getCalendarClient(userId);
      const response = await calendar.calendarList.list();
      return response.data.items || [];
    } catch (error) {
      this.logger.error('Error fetching user calendars:', error);
      return [];
    }
  }
}
