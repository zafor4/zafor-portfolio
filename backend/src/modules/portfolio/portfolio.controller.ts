import { Controller, Get, Post, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProfileService } from '../profile/profile.service';
import { ProjectsService } from '../projects/projects.service';
import { ExperienceService } from '../experience/experience.service';
import { SkillsService } from '../skills/skills.service';
import { ContactService } from '../contact/contact.service';
import { MinioService } from '../minio/minio.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller()
export class PortfolioController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly projectsService: ProjectsService,
    private readonly expService: ExperienceService,
    private readonly skillsService: SkillsService,
    private readonly contactService: ContactService,
    private readonly minioService: MinioService,
  ) {}

  @Get('portfolio')
  async getPortfolioData() {
    const [profile, projects, experiences, skills, contact] = await Promise.all([
      this.profileService.getProfile(),
      this.projectsService.findAll(),
      this.expService.findAll(),
      this.skillsService.findAll(),
      this.contactService.getContact(),
    ]);

    return {
      profile,
      projects,
      experiences,
      skills,
      contact,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('admin/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadMedia(@UploadedFile() file: Express.Multer.File) {
    const url = await this.minioService.uploadFile(file);
    return { url };
  }
}
