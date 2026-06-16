import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { MechanicLead } from 'src/entities/mechanicLead.entity';
import { CreateMechanicLeadDto } from './dto/mechanic-lead.dto';

@Injectable()
export class MechanicLeadsService {
  constructor(
    @InjectRepository(MechanicLead)
    private readonly mechanicLeadRepo: Repository<MechanicLead>,
  ) { }

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

  async findAll(opts: { page: number; limit: number; search?: string; status?: string; }): Promise<{ data: MechanicLead[]; total: number; stats: Record<string, number> }> {
    const { page, limit, search, status } = opts;

    // Build where clause — ILike for case-insensitive search across multiple columns
    const buildWhere = (extra: Record<string, any> = {}) => {
      const base = status && status !== 'all' ? { status, ...extra } : { ...extra };
      if (!search) return base;
      const q = `%${search}%`;
      return [
        { ...base, firstName: ILike(q) },
        { ...base, lastName: ILike(q) },
        { ...base, mobile: ILike(q) },
        { ...base, area: ILike(q) },
        { ...base, shopName: ILike(q) },
      ];
    };

    const [data, total] = await this.mechanicLeadRepo.findAndCount({
      where: buildWhere(),
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const statuses = ['pending', 'contacted', 'onboarded', 'rejected'];
    const counts = await Promise.all(
      statuses.map(s => this.mechanicLeadRepo.count({ where: { status: s } })),
    );
    const totalAll = await this.mechanicLeadRepo.count();
    const stats: Record<string, number> = Object.fromEntries(statuses.map((s, i) => [s, counts[i]]));
    stats['total'] = totalAll;

    return { data, total, stats };
  }

  async findNearby(lat: number, lng: number, radiusKm: number, page: number, limit: number, specializations?: string[], vehicleTypes?: string[]): Promise<{ data: (MechanicLead & { distance: number })[]; total: number }> {
    const leads = await this.mechanicLeadRepo.find({ where: {} });

    const R = 6371;
    const all: (MechanicLead & { distance: number })[] = [];

    for (const lead of leads) {
      if (lead.lat == null || lead.lng == null) continue;

      // Specialization filter — lead must have at least one of the selected
      if (specializations?.length) {
        const has = specializations.some(s => lead.specializations?.includes(s));
        if (!has) continue;
      }

      // Vehicle type filter — lead must handle at least one of the selected
      if (vehicleTypes?.length) {
        const has = vehicleTypes.some(v => lead.vehicleTypes?.includes(v));
        if (!has) continue;
      }

      const dLat = ((lead.lat - lat) * Math.PI) / 180;
      const dLng = ((lead.lng - lng) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat * Math.PI) / 180) *
        Math.cos((lead.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
      const distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      if (distance <= radiusKm) all.push({ ...lead, distance });
    }

    all.sort((a, b) => a.distance - b.distance);
    const data = all.slice((page - 1) * limit, page * limit);
    return { data, total: all.length };
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
