import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { ShopDetails } from "./shopDetails.entity";

export enum VechicleTypeEnum {
    TWO_WHEELER = '2-wheeler',
    FOUR_WHEELER = '4-wheeler',
    HEAVY = 'heavy',
}

@Entity()
export class VechicleTypes {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'enum', enum: VechicleTypeEnum })
    type: VechicleTypeEnum;

    @Column({ nullable: true })
    description: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ nullable: true })
    imageUrl: string; // URL to an image representing the vehicle type

    @ManyToMany(() => ShopDetails, (shopDetails) => shopDetails.vechicleTypes)
    shopDetails: ShopDetails[];
}
