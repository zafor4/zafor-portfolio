import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { Experience } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('experiences')
export class ExperienceController {
  constructor(private readonly expService: ExperienceService) {}

  @Get()
  findAll(): Promise<Experience[]> {
    return this.expService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() body: Partial<Experience>): Promise<Experience> {
    return this.expService.create(body);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Experience>): Promise<Experience> {
    return this.expService.update(id, body);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.expService.remove(id);
  }
}
