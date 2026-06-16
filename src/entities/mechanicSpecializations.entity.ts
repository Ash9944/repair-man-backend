import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ShopDetails } from "./shopDetails.entity";

export enum SpecializationEnum {
    GENERAL = 'general',
    ELECTRICAL = 'electrical',
    AC = 'ac',
    TYRES = 'tyres',
}

@Entity()
export class MechanicSpecializations {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: SpecializationEnum })
    specialization: SpecializationEnum;

    @Column({ nullable: true })
    description: string;

    @Column({ default: true })
    isActive: boolean;

    @ManyToMany(() => ShopDetails, (shopDetails) => shopDetails.specializations)
    shopDetails: ShopDetails[];

    @Column({ nullable: true })
    imageUrl: string; // URL to an image representing the specialization
}
