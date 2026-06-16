import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { MechanicLeadsService } from './mechanic-leads.service';
import { CreateMechanicLeadDto } from './dto/mechanic-lead.dto';
import { JwtAuthGuard } from '../../auth/auth.guard';
import { AdminRoleGuard } from '../../auth/guards/admin.guard';

@Controller('mechanic-leads')
export class MechanicLeadsController {
  constructor(private readonly mechanicLeadsService: MechanicLeadsService) {}

  // Public — mechanic self-registration from landing page
  @Post('register')
  register(@Body() dto: CreateMechanicLeadDto) {
    return this.mechanicLeadsService.register(dto);
  }

  // Admin only — list all leads with pagination, search, status filter
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get()
  findAll(
    @Query('page')   page   = '1',
    @Query('limit')  limit  = '15',
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.mechanicLeadsService.findAll({
      page:   Math.max(1, parseInt(page)   || 1),
      limit:  Math.min(100, parseInt(limit) || 15),
      search: search?.trim() || undefined,
      status: status || undefined,
    });
  }

  // Admin only — find onboarded mechanics within a radius
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Get('nearby')
  findNearby(
    @Query('lat')              lat:              string,
    @Query('lng')              lng:              string,
    @Query('radius')           radius:           string,
    @Query('page')             page            = '1',
    @Query('limit')            limit           = '15',
    @Query('specializations')  specializations?: string,
    @Query('vehicleTypes')     vehicleTypes?:    string,
  ) {
    return this.mechanicLeadsService.findNearby(
      parseFloat(lat),
      parseFloat(lng),
      parseFloat(radius) || 10,
      Math.max(1, parseInt(page)   || 1),
      Math.min(100, parseInt(limit) || 15),
      specializations ? specializations.split(',').map(s => s.trim()) : undefined,
      vehicleTypes    ? vehicleTypes.split(',').map(v => v.trim())    : undefined,
    );
  }

  // Admin only — update lead status
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.mechanicLeadsService.updateStatus(id, status);
  }

  // Admin only — delete a lead
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mechanicLeadsService.remove(id);
  }
}
