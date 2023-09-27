import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth-guard';

import { EmailsDto } from './dto/emails.dto';
import { EmailService } from './email.service';

@Controller('email')
@ApiTags('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async makeEmails(@Body() { emails, text }: EmailsDto) {
    const templates = await this.emailService.makeEmail(emails, text);
    console.log(templates);
    return templates;
  }
}
