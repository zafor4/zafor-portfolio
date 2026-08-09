import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ContactService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.contact.count();
    if (count === 0) {
      await this.prisma.contact.create({
        data: {
          location: 'DHAKA, BANGLADESH',
          email: 'adinahawaldar895@gmail.com',
          linkedin: 'https://linkedin.com/in/adina-hawaldar-17az6',
          github: 'https://github.com/adinahawaldar',
          figma: 'https://figma.com/@adinahawaldar',
          twitter: 'https://twitter.com/@adina_hawaldar',
          githubUsername: 'adinahawaldar',
          officeImageUrl: '/assets/professional_office.png',
        },
      });
    }
  }

  async getContact() {
    const contacts = await this.prisma.contact.findMany();
    return contacts[0];
  }

  async updateContact(dto: any) {
    const contact = await this.getContact();
    if (dto.github) {
      const cleanUrl = dto.github.trim().replace(/\/+$/, '');
      const parts = cleanUrl.split('/');
      const extractedUsername = parts.pop();
      if (extractedUsername && extractedUsername !== 'github.com') {
        dto.githubUsername = extractedUsername;
      }
    }
    return this.prisma.contact.update({
      where: { id: contact.id },
      data: dto,
    });
  }
}
