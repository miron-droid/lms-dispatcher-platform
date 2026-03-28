import { IsEnum, IsString, MinLength } from 'class-validator';
import { ExamDecision } from '@prisma/client';

export class ReviewExamDto {
  @IsEnum(ExamDecision)
  decision: ExamDecision;

  @IsString()
  @MinLength(10, { message: 'Comment must be at least 10 characters' })
  comment: string;
}
