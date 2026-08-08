import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { ProfileModule } from '../profile/profile.module';
import { ProjectsModule } from '../projects/projects.module';
import { ExperienceModule } from '../experience/experience.module';
import { SkillsModule } from '../skills/skills.module';
import { ContactModule } from '../contact/contact.module';
import { MinioModule } from '../minio/minio.module';

@Module({
  imports: [
    ProfileModule,
    ProjectsModule,
    ExperienceModule,
    SkillsModule,
    ContactModule,
    MinioModule,
  ],
  controllers: [PortfolioController],
})
export class PortfolioModule {}
