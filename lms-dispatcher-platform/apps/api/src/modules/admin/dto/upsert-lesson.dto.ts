import { IsEnum, IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';
import { ContentStatus, LessonType } from '@prisma/client';

export class UpsertLessonDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsEnum(LessonType)
  type: LessonType;

  @IsString()
  title: string;

  @IsInt()
  @Min(1)
  order: number;

  @IsObject()
  @IsOptional()
  content?: Record<string, unknown>;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;
}
