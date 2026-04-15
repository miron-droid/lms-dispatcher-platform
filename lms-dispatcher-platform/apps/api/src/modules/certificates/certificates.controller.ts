import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';
import { CertificatesService } from './certificates.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtPayload } from '../../common/types/authenticated-request.type';

@Controller('certificates')
export class CertificatesController {
  constructor(private certs: CertificatesService) {}

  @Get('my')
  async my(@CurrentUser() user: JwtPayload) {
    const certs = await this.certs.myCertificates(user.sub);
    const eligible = await this.certs.isEligible(user.sub);
    return { certificates: certs, eligible };
  }

  @Get('generate')
  async generate(@CurrentUser() user: JwtPayload) {
    return this.certs.generateForUser(user.sub);
  }

  @Get(':id/pdf')
  async getPdf(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Res() res: Response,
  ) {
    const pdf = await this.certs.getCertificatePdf(user.sub, id);
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="dispatchgo-certificate-${id}.pdf"`,
      'Content-Length': pdf.length,
    });
    res.send(pdf);
  }
}
