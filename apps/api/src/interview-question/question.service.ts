import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common/exceptions';
import { PrismaService } from 'src/prisma.service';

import { CreateQuestionDto } from './dto/createQuestion.dto';

@Injectable()
export class QuestionService {
  constructor(private readonly prisma: PrismaService) {}

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
        ...questionData,
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
