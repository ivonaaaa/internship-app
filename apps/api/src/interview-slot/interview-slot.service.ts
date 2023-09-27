import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InterviewStatus } from '@prisma/client';
import { Discipline } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';

import { CreateInterviewSlotDto } from './dto/createInterviewSlot.dto';

@Injectable()
export class InterviewSlotService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    const interviewSlots = await this.prisma.interviewSlot.findMany({
      include: {
        interviewers: {
          include: {
            interviewer: true,
            interviewSlot: true,
          },
        },
      },
    });
    return interviewSlots;
  }

  async getByInterviewers(interviewerNames: string[]) {
    const interviewSlots = await this.prisma.interviewSlot.findMany({
      where: {
        interviewers: {
          some: {
            interviewer: {
              name: {
                in: interviewerNames,
              },
            },
          },
        },
      },
      include: {
        interviewers: {
          include: {
            interviewer: true,
            interviewSlot: true,
          },
        },
      },
    });
    return interviewSlots;
  }

  async getByDisciplines(disciplines: string[]) {
    const mappedDisciplines: Discipline[] = disciplines.map((str) => {
      switch (str) {
        case 'Development':
          return Discipline.Development;
        case 'Design':
          return Discipline.Design;
        case 'Multimedia':
          return Discipline.Multimedia;
        case 'Marketing':
          return Discipline.Marketing;
        default:
          return Discipline.Development;
      }
    });

    const interviewSlots = await this.prisma.interviewSlot.findMany({
      where: {
        interviewers: {
          some: {
            interviewer: {
              disciplines: {
                hasSome: mappedDisciplines,
              },
            },
          },
        },
      },
      include: {
        interviewers: {
          include: {
            interviewer: true,
            interviewSlot: true,
          },
        },
      },
    });
    return interviewSlots;
  }

  async deleteInterviewSlot(id: string) {
    return await this.prisma.interviewSlot.delete({
      where: { id },
    });
  }

  async createInterviewSlot(interviewSlotDto: CreateInterviewSlotDto) {
    const { start, end } = interviewSlotDto;
    const interviewSlots = [];

    const slotDuration = 20 * 60 * 1000;

    for (
      let currentTime = new Date(start).getTime();
      currentTime < new Date(end).getTime();
      currentTime += slotDuration
    ) {
      const slotStart = new Date(currentTime);
      const slotEnd = new Date(currentTime + slotDuration);

      const interviewSlot = await this.prisma.interviewSlot.create({
        data: {
          start: slotStart,
          end: slotEnd,
          answers: JSON.stringify({}),
          notes: interviewSlotDto.notes,
        },
      });

      interviewSlots.push(interviewSlot);

      for (const interviewerName of interviewSlotDto.interviewers) {
        const interviewer = await this.prisma.interviewer.findFirst({
          where: { name: interviewerName },
        });

        if (interviewer) {
          await this.prisma.interviewMemberParticipation.create({
            data: {
              interviewSlotId: interviewSlot.id,
              interviewerId: interviewer.id,
            },
          });
        }
      }
    }
    return interviewSlots;
  }

  async getAvailableSlots(internId: string) {
    const intern = await this.prisma.intern.findUnique({
      where: { id: internId },
      include: {
        internDisciplines: {
          orderBy: {
            priority: 'asc',
          },
        },
        interviewSlot: true,
      },
    });

    if (!intern) {
      throw new NotFoundException('Intern not found');
    }

    if (intern.interviewSlot) {
      throw new BadRequestException('Interview already scheduled');
    }

    if (intern.interviewStatus !== InterviewStatus.PickTerm) {
      throw new BadRequestException(
        'Intern does not have the right to schedule interview',
      );
    }

    const [primaryDiscipline, ...otherDisciplines] =
      intern.internDisciplines.filter((ind) => ind.status === 'Pending');

    const availableSlots = await this.prisma.interviewSlot.findMany({
      where: {
        internId: null,
        AND: [
          {
            interviewers: {
              some: {
                interviewer: {
                  disciplines: {
                    has: primaryDiscipline.discipline,
                  },
                },
              },
            },
          },
          otherDisciplines.length > 0
            ? {
                interviewers: {
                  some: {
                    interviewer: {
                      disciplines: {
                        hasSome: otherDisciplines.map((d) => d.discipline),
                      },
                    },
                  },
                },
              }
            : {},
        ],
      },
    });

    return availableSlots;
  }

  async scheduleInterview(slotId: string, internId: string) {
    const slot = await this.prisma.interviewSlot.findUnique({
      where: { id: slotId },
    });

    if (slot.internId) {
      throw new NotFoundException('Slot is already taken');
    }

    const internSlot = await this.prisma.interviewSlot.findFirst({
      where: { internId },
    });

    if (internSlot) {
      throw new NotFoundException('Intern already has a slot');
    }

    return await this.prisma.intern.update({
      where: { id: internId, interviewStatus: InterviewStatus.PickTerm },
      data: {
        interviewStatus: InterviewStatus.Pending,
        interviewSlot: {
          connect: {
            id: slotId,
          },
        },
      },
    });
  }
}
