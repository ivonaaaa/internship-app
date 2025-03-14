import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AdminLogAction } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';
import { LoggerService } from 'src/logger/logger.service';

import { CreateQuestionDto } from './dto/createQuestion.dto';
import { QuestionService } from './question.service';

@Controller('/question')
@ApiTags('question')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly loggerService: LoggerService,
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAll() {
    const questions = await this.questionService.getAll();
    return questions;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() question: CreateQuestionDto) {
    await this.loggerService.createAdminLog(
      AdminLogAction.Create,
      `Kreiranje pitanja ${question.question}`,
    );

    const newQuestion = await this.questionService.create(question);
    return newQuestion;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    await this.loggerService.createAdminLog(
      AdminLogAction.Delete,
      `Brisanje pitanja ${id}`,
    );

    const deletedQuestion = await this.questionService.delete(id);
    return deletedQuestion;
  }

  @Get('options')
  @UseGuards(JwtAuthGuard)
  async getQuestionOptions() {
    return await this.questionService.getQuestionOptions();
  }
}
