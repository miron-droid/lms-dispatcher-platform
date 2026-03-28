import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const { statusCode, message } = this.map(exception);
    response.status(statusCode).json({
      success: false,
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  private map(e: Prisma.PrismaClientKnownRequestError) {
    switch (e.code) {
      case 'P2002':
        return { statusCode: HttpStatus.CONFLICT, message: 'Resource already exists' };
      case 'P2025':
        return { statusCode: HttpStatus.NOT_FOUND, message: 'Resource not found' };
      default:
        return { statusCode: HttpStatus.INTERNAL_SERVER_ERROR, message: 'Database error' };
    }
  }
}
