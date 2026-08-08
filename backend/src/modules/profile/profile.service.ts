import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.profile.count();
    if (count === 0) {
      await this.prisma.profile.create({
        data: {
          name: 'Humayra Arzooman',
          title: 'UI/UX Designer & Product Designer',
          location: 'Dhaka, Bangladesh',
          statement: '[A product-focused Designer & Founder from Bangladesh, building high-performance digital experiences where modern design meets scalable technology, cloud innovation, and intelligent solutions.]',
          availableForWork: true,
          resumeUrl: '/resume.pdf',
          avatarUrl: '/assets/adina.jpeg',
        },
      });
    }
  }

  async getProfile() {
    const profiles = await this.prisma.profile.findMany();
    return profiles[0];
  }

  async updateProfile(dto: any) {
    const profile = await this.getProfile();
    return this.prisma.profile.update({
      where: { id: profile.id },
      data: dto,
    });
  }
}
