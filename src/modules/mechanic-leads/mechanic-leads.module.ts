import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MechanicLead } from '../../entities/mechanicLead.entity';
import { MechanicLeadsController } from './mechanic-leads.controller';
import { MechanicLeadsService } from './mechanic-leads.service';

@Module({
  imports: [TypeOrmModule.forFeature([MechanicLead])],
  controllers: [MechanicLeadsController],
  providers: [MechanicLeadsService],
})
export class MechanicLeadsModule {}
