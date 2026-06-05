import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MechanicLead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  mobile: string;

  @Column({ default: '+91' })
  country_code: string;

  @Column({ nullable: true })
  area: string;

  @Column('simple-array', { nullable: true })
  vehicleTypes: string[]; // ['2-wheeler', '4-wheeler', 'heavy']

  @Column('simple-array', { nullable: true })
  specializations: string[]; // ['general', 'electrical', 'ac', 'tyres']

  @Column({ nullable: true })
  experience: number; // years

  @Column({ default: false })
  hasOwnTools: boolean;

  // Shop details
  @Column({ nullable: true })
  shopName: string;

  @Column({ nullable: true })
  shopAddress: string;

  @Column({ nullable: true })
  workingHoursFrom: string; // e.g. "08:00"

  @Column({ nullable: true })
  workingHoursTo: string; // e.g. "20:00"

  // Location (map pin)
  @Column({ type: 'float', nullable: true })
  lat: number;

  @Column({ type: 'float', nullable: true })
  lng: number;

  @Column({ default: 'pending' })
  status: string; // pending | contacted | onboarded | rejected

  @CreateDateColumn()
  created_at: Date;
}
