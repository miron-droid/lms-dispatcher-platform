import { IsArray, IsString, IsUUID, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class AnswerDto {
  @IsUUID()
  questionId: string;

  @IsArray()
  @IsString({ each: true })
  selectedOptionIds: string[];
}

export class SubmitTestDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AnswerDto)
  answers: AnswerDto[];
}
