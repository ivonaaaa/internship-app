import { IsString, IsEnum, IsOptional, IsArray } from 'class-validator';

export enum QuestionType {
  OPEN = 'OPEN',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

export class CreateQuestionDto {
  @IsString()
  question!: string;

  @IsEnum(QuestionType)
  type!: QuestionType;

  @IsString()
  category!: string;

  @IsOptional()
  @IsArray()
  options?: string[];
}
