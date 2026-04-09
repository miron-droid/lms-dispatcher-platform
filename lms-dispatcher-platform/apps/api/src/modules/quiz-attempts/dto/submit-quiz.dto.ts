import { IsInt, IsNotEmpty, IsString, Max, Min, IsDefined } from 'class-validator';

export class SubmitQuizDto {
  @IsString()
  @IsNotEmpty()
  lessonId!: string;

  // Accept either array (frontend currently sends number[]) or object map
  @IsDefined()
  answers!: number[] | Record<string, number | number[]>;

  @IsInt()
  @Min(0)
  totalQuestions!: number;

  @IsInt()
  @Min(0)
  correctAnswers!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  score!: number;
}
