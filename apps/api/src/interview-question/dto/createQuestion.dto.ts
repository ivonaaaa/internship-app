import { ApiProperty } from '@nestjs/swagger';
import { QuestionType, QuestionCategory } from '@prisma/client';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsArray,
} from 'class-validator';

export class CreateQuestionDto {
  @IsString()
  @ApiProperty()
  question: string;

  @IsEnum(QuestionType)
  @ApiProperty({ enum: QuestionType })
  type: QuestionType;

  @IsEnum(QuestionCategory)
  @ApiProperty({ enum: QuestionCategory })
  category: QuestionCategory;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  minValue?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false })
  maxValue?: number;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ required: false, default: 1 })
  stepValue?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({ required: false, type: [String] })
  options?: string[];
}
