import { Body, Controller, Post } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';
import { IsString } from 'class-validator';

class PushSubscribeDto {
  @IsString() endpoint: string;
  @IsString() p256dh: string;
  @IsString() auth: string;
}

@Controller('notifications')
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @Post('push/subscribe')
  subscribe(@CurrentUser() user: JwtPayload, @Body() dto: PushSubscribeDto) {
    return this.notifications.subscribe(user.sub, dto);
  }
}
