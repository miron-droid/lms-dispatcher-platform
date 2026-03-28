import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as webpush from 'web-push';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(private prisma: PrismaService, private cfg: ConfigService) {
    const vapidPublic = cfg.get('VAPID_PUBLIC_KEY');
    const vapidPrivate = cfg.get('VAPID_PRIVATE_KEY');
    const vapidEmail = cfg.get('VAPID_EMAIL', 'mailto:admin@example.com');
    if (vapidPublic && vapidPrivate) {
      webpush.setVapidDetails(vapidEmail, vapidPublic, vapidPrivate);
    }
  }

  async subscribe(userId: string, sub: { endpoint: string; p256dh: string; auth: string }) {
    return this.prisma.pushSubscription.upsert({
      where: { userId_endpoint: { userId, endpoint: sub.endpoint } },
      update: { p256dh: sub.p256dh, auth: sub.auth },
      create: { userId, ...sub },
    });
  }

  async sendPush(userId: string, payload: { title: string; body: string; url?: string }) {
    const subs = await this.prisma.pushSubscription.findMany({ where: { userId } });
    for (const sub of subs) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          JSON.stringify(payload),
        );
      } catch (err) {
        this.logger.warn(`Push failed for ${sub.endpoint}: ${err.message}`);
        if ((err as any).statusCode === 410) {
          await this.prisma.pushSubscription.delete({ where: { id: sub.id } });
        }
      }
    }
  }
}
