import { Module } from '@nestjs/common';
import { LoggerService } from 'src/logger/logger.service';
import { PrismaService } from 'src/prisma.service';

import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';

@Module({
  controllers: [QuestionController],
  providers: [QuestionService, LoggerService, PrismaService],
  exports: [QuestionService],
})
export class QuestionModule {}
