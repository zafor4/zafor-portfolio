import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ExperienceService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.experience.count();
    if (count === 0) {
      const defaultExp = [
        {
          company: 'IDEM Studio',
          role: 'Founder & CEO',
          duration: '2026 - current',
          desc: 'Founder of Idem Studio, creating modern digital experiences through design, development, AI, and automation from concept to high-performance products.',
          sortOrder: 1,
        },
        {
          company: 'HEProAI',
          role: 'Cloud Engineer',
          duration: 'Nov 2025 - Jan 2026',
          desc: 'Architected scalable AWS environments and automated security protocols for high-availability applications.',
          sortOrder: 2,
        },
        {
          company: 'Pinnacle Infotech',
          role: 'Cloud Engineer',
          duration: 'June 2024 - Aug 2024',
          desc: 'Deployed enterprise infrastructure using CloudFormation and boosted deployment velocity by 50%.',
          sortOrder: 3,
        },
      ];
      for (const e of defaultExp) {
        await this.prisma.experience.create({ data: e });
      }
    }
  }

  async findAll() {
    return this.prisma.experience.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async create(dto: any) {
    return this.prisma.experience.create({ data: dto });
  }

  async update(id: string, dto: any) {
    return this.prisma.experience.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.prisma.experience.delete({ where: { id } });
  }
}
