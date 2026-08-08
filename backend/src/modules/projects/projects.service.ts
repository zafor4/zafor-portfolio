import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProjectsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.project.count();
    if (count === 0) {
      const defaultProjects = [
        {
          title: 'Snippit',
          type: 'website',
          image: '/assets/snippit.png',
          description: 'An open-source SaaS starter registry',
          technologies: ['React', 'Tailwind'],
          github: 'https://github.com/adinahawaldar/snippit',
          live: 'https://snippit-dev.vercel.app/',
          sortOrder: 1,
        },
        {
          title: 'Zentra',
          type: 'website',
          image: '/assets/zentra.png',
          description: 'Decentralized Civic Infrastructure Management Platform',
          technologies: ['React', 'Tailwind'],
          github: 'https://github.com/adinahawaldar/zentra',
          live: 'https://zentra-ten.vercel.app/',
          sortOrder: 2,
        },
        {
          title: 'Autovion',
          type: 'ui/ux',
          image: '/assets/autovion.png',
          description: 'Luxury car showroom UI focused on clarity.',
          technologies: ['Figma', 'Branding'],
          figma: 'https://www.figma.com/design/xX2KTf91gwtdpHaCBSghlz/Autovion?t=oSsae7DAQE5zYa9h-1',
          sortOrder: 3,
        },
        {
          title: 'Zen',
          type: 'ui/ux',
          image: '/assets/zen.png',
          description: 'Architecture website design.',
          technologies: ['Figma', 'Prototype'],
          figma: 'https://www.figma.com/design/rMF571Vdq8kAHGTv5srtCp/Untitled?node-id=0-1&t=wTuhogRbZhysb8NY-1',
          sortOrder: 4,
        },
        {
          title: 'Smartchain',
          type: 'website',
          image: '/assets/smartchain.png',
          description: 'AI Supply chain control tower',
          technologies: ['React', 'ML'],
          github: 'https://github.com/adinahawaldar/Smart-chain',
          live: 'https://smart-chain-ossk.vercel.app/',
          sortOrder: 5,
        },
        {
          title: 'Artwork',
          type: 'ui/ux',
          image: '/assets/artwork.png',
          description: 'Artwork Gallery Design.',
          technologies: ['Figma', 'UI'],
          figma: 'https://www.figma.com/design/xe3V32YLb8xSC1xzgDoxOi/Untitled?node-id=0-1&t=cwGM42qXVpOQ5UpF-1',
          sortOrder: 6,
        },
        {
          title: 'Law Firm',
          type: 'ui/ux',
          image: '/assets/lawfirm.png',
          description: 'Law Firm Website Design.',
          technologies: ['Figma', 'UI'],
          figma: 'https://www.figma.com/design/jCyOYI6jSujE0s6aJwg8ca/Untitled?node-id=0-1&t=CuNiBHd9S4i07Pgz-1',
          sortOrder: 7,
        },
        {
          title: 'Restaurant',
          type: 'ui/ux',
          image: '/assets/restaurant.png',
          description: 'Restaurant Website UI.',
          technologies: ['Figma', 'UI'],
          figma: 'https://www.figma.com/design/XOE9NAdIeFFysXMO1A3grl/Rumman-%E2%80%94-Modern-Food-Restaurant-Website-UI-Design--Community-?node-id=0-1&t=6fFiP9DJLS83e11K-1',
          sortOrder: 8,
        },
      ];
      for (const p of defaultProjects) {
        await this.prisma.project.create({ data: p });
      }
    }
  }

  async findAll() {
    return this.prisma.project.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async findOne(id: string) {
    return this.prisma.project.findUnique({ where: { id } });
  }

  async create(dto: any) {
    return this.prisma.project.create({ data: dto });
  }

  async update(id: string, dto: any) {
    return this.prisma.project.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.prisma.project.delete({ where: { id } });
  }
}
