import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SkillsService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    const count = await this.prisma.skill.count();
    if (count === 0) {
      const defaultSkills = [
        { name: 'React', category: 'Frontend Framework', icon: 'Code2', bg: 'bg-[#61dafb]', color: 'text-black', sortOrder: 1 },
        { name: 'Node.js', category: 'Backend Engineering', icon: 'Server', bg: 'bg-[#339933]', color: 'text-white', sortOrder: 2 },
        { name: 'Tailwind CSS', category: 'Styling Framework', icon: 'Layout', bg: 'bg-[#38bdf8]', color: 'text-white', sortOrder: 3 },
        { name: 'Figma', category: 'UI/UX Design', icon: 'Palette', bg: 'bg-zinc-900 dark:bg-zinc-100', color: 'text-white dark:text-black', sortOrder: 4 },
        { name: 'Product Design', category: 'Strategy & UX', icon: 'Layers', bg: 'bg-foreground', color: 'text-background', sortOrder: 5 },
        { name: 'Graphics Design', category: 'Visual Identity', icon: 'Cpu', bg: 'bg-[#ff007f]', color: 'text-white', sortOrder: 6 },
        { name: 'AWS', category: 'Cloud Infrastructure', icon: 'Cloud', bg: 'bg-[#232F3E]', color: 'text-white', sortOrder: 7 },
        { name: 'Firebase', category: 'Backend Services', icon: 'Database', bg: 'bg-[#ffca28]', color: 'text-black', sortOrder: 8 },
        { name: 'Python', category: 'Backend / Scripting', icon: 'Terminal', bg: 'bg-[#3776ab]', color: 'text-white', sortOrder: 9 },
        { name: 'MongoDB', category: 'Database', icon: 'Database', bg: 'bg-[#47a248]', color: 'text-white', sortOrder: 10 },
        { name: 'Git & GitHub', category: 'Version Control', icon: 'GitBranch', bg: 'bg-[#181717]', color: 'text-white', sortOrder: 11 },
        { name: 'Canva', category: 'Design Software', icon: 'Palette', bg: 'bg-[#00c4cc]', color: 'text-white', sortOrder: 12 },
        { name: 'Java', category: 'Programming', icon: 'FileCode', bg: 'bg-[#5382a1]', color: 'text-white', sortOrder: 13 },
        { name: 'HTML & CSS', category: 'Web Foundation', icon: 'Code2', bg: 'bg-[#e34f26]', color: 'text-white', sortOrder: 14 },
      ];
      for (const s of defaultSkills) {
        await this.prisma.skill.create({ data: s });
      }
    }
  }

  async findAll() {
    return this.prisma.skill.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  async create(dto: any) {
    return this.prisma.skill.create({ data: dto });
  }

  async update(id: string, dto: any) {
    return this.prisma.skill.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    await this.prisma.skill.delete({ where: { id } });
  }
}
