import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { PrismaService } from 'src/prisma.service';

import { CreateQuestionDto, QuestionType } from './dto/createQuestion.dto';

enum QuestionCategory {
  General = 'General',
  Personal = 'Personal',
  Final = 'Final',
  Dev = 'Development',
  Marketing = 'Marketing',
  Design = 'Design',
  Multimedia = 'Multimedia',
}

enum DbQuestionType {
  Checkbox = 'Checkbox',
  Radio = 'Radio',
  Slider = 'Slider',
  Field = 'Field',
  Select = 'Select',
  TextArea = 'TextArea',
  Number = 'Number',
  Date = 'Date',
  DateTime = 'DateTime',
}

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

  private mapDtoTypeToDbType(dtoType: QuestionType): DbQuestionType {
    switch (dtoType) {
      case QuestionType.OPEN:
        return DbQuestionType.TextArea;
      case QuestionType.MULTIPLE_CHOICE:
        return DbQuestionType.Checkbox;
      default:
        throw new BadRequestException('Unsupported question type');
    }
  }

  private mapCategoryToDbCategory(category: string): QuestionCategory {
    try {
      const dbCategory = category as QuestionCategory;

      if (!Object.values(QuestionCategory).includes(dbCategory))
        throw new Error();

      return dbCategory;
    } catch (error) {
      throw new BadRequestException(
        `Invalid category: ${category}. Valid categories are: ${Object.values(
          QuestionCategory,
        ).join(', ')}`,
      );
    }
  }

  private mapDtoTypeToDbType(dtoType: QuestionType): DbQuestionType {
    switch (dtoType) {
      case QuestionType.OPEN:
        return DbQuestionType.TextArea;
      case QuestionType.MULTIPLE_CHOICE:
        return DbQuestionType.Checkbox;
      default:
        throw new BadRequestException('Unsupported question type');
    }
  }

  private mapCategoryToDbCategory(category: string): QuestionCategory {
    try {
      const dbCategory = category as QuestionCategory;

      if (!Object.values(QuestionCategory).includes(dbCategory))
        throw new Error();

      return dbCategory;
    } catch (error) {
      throw new BadRequestException(
        `Invalid category: ${category}. Valid categories are: ${Object.values(
          QuestionCategory,
        ).join(', ')}`,
      );
    }
  }

  async getAll() {
    const questions = await this.prisma.interviewQuestion.findMany({
      include: {
        QuestionOption: true,
      },
    });

    return questions.sort((a, b) => a.question.localeCompare(b.question));
  }

  async create(questionToCreate: CreateQuestionDto) {
    const questionWithTheSameText =
      await this.prisma.interviewQuestion.findFirst({
        where: {
          question: {
            equals: questionToCreate.question,
            mode: 'insensitive',
          },
        },
      });

    if (questionWithTheSameText) {
      throw new BadRequestException(
        'Question with the same text already exists',
      );
    }

    const { options, ...questionData } = questionToCreate;

    const newQuestion = await this.prisma.interviewQuestion.create({
      data: {
        question: questionData.question,
        type: this.mapDtoTypeToDbType(questionData.type),
        category: this.mapCategoryToDbCategory(questionData.category),
        question: questionData.question,
        type: this.mapDtoTypeToDbType(questionData.type),
        category: this.mapCategoryToDbCategory(questionData.category),
        QuestionOption: options
          ? {
              createMany: {
                data: options.map((option) => ({ value: option })),
              },
            }
          : undefined,
      },
      include: {
        QuestionOption: true,
      },
    });

    return newQuestion;
  }

  async delete(id: string) {
    const questionToDelete = await this.prisma.interviewQuestion.findUnique({
      where: {
        id: id,
      },
    });

    if (!questionToDelete) {
      throw new BadRequestException('Question does not exist');
    }

    await this.prisma.questionOption.deleteMany({
      where: {
        questionId: id,
      },
    });

    const deletedQuestion = await this.prisma.interviewQuestion.delete({
      where: {
        id,
      },
    });

    return deletedQuestion;
  }

  async getQuestionOptions() {
    return await this.prisma.questionOption.findMany();
  }
}
