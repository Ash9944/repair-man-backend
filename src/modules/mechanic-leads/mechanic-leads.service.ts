import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MechanicLead } from 'src/entities/mechanicLead.entity';
import { CreateMechanicLeadDto } from './dto/mechanic-lead.dto';

@Injectable()
export class MechanicLeadsService {
  constructor(
    @InjectRepository(MechanicLead)
    private readonly mechanicLeadRepo: Repository<MechanicLead>,
  ) {}

  async register(dto: CreateMechanicLeadDto): Promise<{ message: string }> {
    const existing = await this.mechanicLeadRepo.findOne({
      where: { mobile: dto.mobile },
    });

    if (existing) {
      throw new ConflictException('This mobile number is already registered.');
    }

    const lead = this.mechanicLeadRepo.create(dto);
    await this.mechanicLeadRepo.save(lead);

    return { message: 'Registered successfully! We will reach out to you soon.' };
  }

  async findAll(): Promise<MechanicLead[]> {
    return this.mechanicLeadRepo.find({ order: { created_at: 'DESC' } });
  }

  async updateStatus(id: string, status: string): Promise<MechanicLead> {
    const lead = await this.mechanicLeadRepo.findOne({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');
    lead.status = status;
    return this.mechanicLeadRepo.save(lead);
  }

  async remove(id: string): Promise<void> {
    const lead = await this.mechanicLeadRepo.findOne({ where: { id } });
    if (!lead) throw new NotFoundException('Lead not found');
    await this.mechanicLeadRepo.remove(lead);
  }
}
