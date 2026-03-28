import {
  IsEnum, IsInt, IsOptional, IsString, IsUUID, Max, Min,
} from 'class-validator';
import { ContentStatus } from '@prisma/client';

export class UpsertChapterDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsInt()
  @Min(1)
  order: number;

  @IsEnum(ContentStatus)
  @IsOptional()
  status?: ContentStatus;

  @IsInt()
  @Min(50)
  @Max(100)
  @IsOptional()
  passThreshold?: number;
}
