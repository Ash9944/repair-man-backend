import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { MechanicLeadsService } from './mechanic-leads.service';
import { CreateMechanicLeadDto } from './dto/mechanic-lead.dto';
import { JwtAuthGuard } from 'src/auth/auth.guard';

@Controller('mechanic-leads')
export class MechanicLeadsController {
  constructor(private readonly mechanicLeadsService: MechanicLeadsService) {}

  @Post('register')
  register(@Body() dto: CreateMechanicLeadDto) {
    return this.mechanicLeadsService.register(dto);
  }

  // Admin only — list all registered mechanic leads
  // @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.mechanicLeadsService.findAll();
  }

  // Admin only — update lead status
  @UseGuards(JwtAuthGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.mechanicLeadsService.updateStatus(id, status);
  }

  // Admin only — delete a lead
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mechanicLeadsService.remove(id);
  }
}
