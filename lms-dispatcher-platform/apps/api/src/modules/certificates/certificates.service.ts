import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as PDFDocument from 'pdfkit';

const COURSE_ID = 'course-dispatchers-v1';
const TOTAL_CHAPTERS = 9;

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async myCertificates(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async isEligible(userId: string): Promise<boolean> {
    const completedCount = await this.prisma.chapterProgress.count({
      where: { userId, status: 'COMPLETED' },
    });
    return completedCount >= TOTAL_CHAPTERS;
  }

  async generateForUser(userId: string) {
    if (!(await this.isEligible(userId))) {
      throw new ForbiddenException('Course not yet completed');
    }

    const existing = await this.prisma.certificate.findUnique({
      where: { userId_courseId: { userId, courseId: COURSE_ID } },
    });
    if (existing) return existing;

    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      include: { company: { select: { name: true } } },
    });

    const year = new Date().getFullYear();
    const count = await this.prisma.certificate.count();
    const certNumber = `DG-${year}-${String(count + 1).padStart(5, '0')}`;

    return this.prisma.certificate.create({
      data: {
        userId,
        courseId: COURSE_ID,
        certNumber,
        studentName: `${user.firstName} ${user.lastName}`.trim(),
        companyName: user.company?.name ?? null,
      },
    });
  }

  async getCertificatePdf(userId: string, certId: string): Promise<Buffer> {
    const cert = await this.prisma.certificate.findUnique({
      where: { id: certId },
    });
    if (!cert) throw new NotFoundException('Certificate not found');
    if (cert.userId !== userId) {
      const user = await this.prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
      if (!['ADMIN', 'MANAGER', 'SUPER_ADMIN'].includes(user?.role ?? '')) {
        throw new ForbiddenException('Not your certificate');
      }
    }

    return this.renderPdf(cert);
  }

  private async renderPdf(cert: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        layout: 'landscape',
        margin: 50,
      });

      const chunks: Buffer[] = [];
      doc.on('data', (c) => chunks.push(c));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const w = doc.page.width;
      const h = doc.page.height;

      doc.rect(30, 30, w - 60, h - 60).lineWidth(3).stroke('#1e40af');
      doc.rect(40, 40, w - 80, h - 80).lineWidth(1).stroke('#60a5fa');

      doc.fontSize(10).fillColor('#60a5fa').text('DISPATCHGO', 0, 70, { align: 'center', characterSpacing: 8 });

      doc.fontSize(44).fillColor('#1e40af').font('Helvetica-Bold').text('Certificate of Completion', 0, 110, { align: 'center' });

      doc.fontSize(14).fillColor('#64748b').font('Helvetica').text('This is to certify that', 0, 180, { align: 'center' });

      doc.fontSize(36).fillColor('#0f172a').font('Helvetica-Bold').text(cert.studentName, 0, 210, { align: 'center' });

      const nameY = 270;
      doc.moveTo(w / 2 - 150, nameY).lineTo(w / 2 + 150, nameY).lineWidth(1).stroke('#cbd5e1');

      doc.fontSize(14).fillColor('#475569').font('Helvetica').text(
        'has successfully completed the comprehensive training program',
        0, 285,
        { align: 'center' }
      );

      doc.fontSize(22).fillColor('#1e40af').font('Helvetica-Bold').text(
        'Freight Dispatcher Training \u2014 US Trucking',
        0, 310,
        { align: 'center' }
      );

      doc.fontSize(12).fillColor('#64748b').font('Helvetica').text(
        '9 Chapters \u00B7 36 Lessons \u00B7 180 Daily Exam Questions',
        0, 345,
        { align: 'center' }
      );

      if (cert.companyName) {
        doc.fontSize(13).fillColor('#475569').font('Helvetica-Oblique').text(
          `Issued to employee of ${cert.companyName}`,
          0, 380,
          { align: 'center' }
        );
      }

      const bottomY = h - 130;
      const dateStr = new Date(cert.issuedAt).toLocaleDateString('en-US', {
        year: 'numeric', month: 'long', day: 'numeric',
      });

      doc.fontSize(10).fillColor('#64748b').font('Helvetica').text('DATE ISSUED', 90, bottomY, { width: 200 });
      doc.fontSize(14).fillColor('#0f172a').font('Helvetica-Bold').text(dateStr, 90, bottomY + 15, { width: 200 });

      doc.fontSize(10).fillColor('#64748b').font('Helvetica').text('CERTIFICATE NO.', w - 290, bottomY, { width: 200, align: 'right' });
      doc.fontSize(14).fillColor('#0f172a').font('Helvetica-Bold').text(cert.certNumber, w - 290, bottomY + 15, { width: 200, align: 'right' });

      doc.moveTo(w / 2 - 80, bottomY + 10).lineTo(w / 2 + 80, bottomY + 10).lineWidth(1).stroke('#94a3b8');
      doc.fontSize(10).fillColor('#64748b').text('DispatchGO Training', 0, bottomY + 15, { align: 'center' });
      doc.fontSize(9).fillColor('#94a3b8').text('dispatchgo.net', 0, bottomY + 30, { align: 'center' });

      doc.end();
    });
  }
}
