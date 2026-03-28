import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class RequestExamDto {
  @IsUUID()
  chapterId: string;

  @IsDateString()
  @IsOptional()
  preferredAt?: string;
}
