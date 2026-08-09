import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicationsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.publication.count();
    if (count === 0) {
      await this.prisma.publication.createMany({
        data: [
          {
            title: 'User-Centered Design Framework for AI-Driven Cloud Infrastructure Dashboards',
            publisher: 'IEEE International Conference on Human-Computer Interaction',
            year: '2025',
            authors: 'Humayra Arzooman, Tanvir Ahmed, Zariyan Khan',
            abstract: 'This research paper proposes a unified UI/UX framework optimizing cognitive workload for cloud architecture management, integrating real-time telemetry visualizations with predictive analytics.',
            doi: '10.1109/HCI.2025.109482',
            link: 'https://doi.org/10.1109/HCI.2025.109482',
            pdfUrl: '/documents/research_paper_1.pdf',
            tags: ['UI/UX Design', 'Cloud Telemetry', 'AI Systems', 'HCI Framework'],
            sortOrder: 1,
          },
          {
            title: 'Scalable Micro-Frontends & Design Systems in High-Throughput Fintech Applications',
            publisher: 'Springer Journal of Systems and Software',
            year: '2024',
            authors: 'Humayra Arzooman, Rahman Chowdhury',
            abstract: 'An empirical investigation into design token synchronization across micro-frontend architectures, reducing UI regression bugs by 45% in production environments.',
            doi: '10.1007/s10664-024-09823-x',
            link: 'https://springer.com/journal/article/2024',
            pdfUrl: '/documents/research_paper_2.pdf',
            tags: ['Design Systems', 'Micro-Frontends', 'Product Design'],
            sortOrder: 2,
          },
        ],
      });
    }
  }

  async findAll() {
    return this.prisma.publication.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(data: any) {
    return this.prisma.publication.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.publication.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return this.prisma.publication.delete({
      where: { id },
    });
  }
}
