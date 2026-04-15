import { IsInt, IsNotEmpty, IsString, Max, Min, IsDefined } from "class-validator";

/**
 * Rich per-question answer entry sent by the frontend.
 * The backend verifies correctness server-side by comparing
 * against Lesson.content.quiz.questions[].correctIndex.
 */
export interface QuizAnswerEntry {
  questionId: string;
  selectedIndex: number;
}

export class SubmitQuizDto {
  @IsString()
  @IsNotEmpty()
  lessonId!: string;

  // Accept either:
  //   - legacy simple format: number[]  (index per question)
  //   - rich format: { questionId, selectedIndex }[]
  //   - legacy object map: Record<string, number | number[]>
  @IsDefined()
  answers!: number[] | QuizAnswerEntry[] | Record<string, number | number[]>;

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
