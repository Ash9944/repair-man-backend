import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProviderAddresses } from "./providerAddress.entity";
import { VechicleTypes } from "./vechicleTypes.entity";
import { MechanicSpecializations } from "./mechanicSpecializations.entity";
import { User } from "./user.entity";

@Entity()
export class ShopDetails {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    shopName: string;

    @OneToMany(() => ProviderAddresses, (address) => address.shop, { cascade: true })
    shopAddress: ProviderAddresses[];

    @Column({ nullable: true })
    workingHoursFrom: string; // e.g. "08:00"

    @Column({ nullable: true })
    workingHoursTo: string; // e.g. "20:00"

    @ManyToMany(() => VechicleTypes, (vechicleType) => vechicleType.shopDetails)
    @JoinTable({ name: "shop_vehicle_types" })
    vechicleTypes: VechicleTypes[];

    @ManyToMany(() => MechanicSpecializations, (mechanicSpecialization) => mechanicSpecialization.shopDetails)
    @JoinTable({ name: "shop_specializations" })
    specializations: MechanicSpecializations[];

    @Column({ type: 'float', nullable: true })
    experience: number; // years

    @Column({ nullable: true })
    imageUrl: string; // URL to an image representing the shop

    @Column({ nullable: true })
    additionalInfo: string; // Any additional information about the shop

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    hasOwnTools: boolean; // Whether the shop has its own tools for repairs

    @ManyToOne(() => User, (user) => user.shopDetails, { onDelete: 'CASCADE' })
    @JoinColumn({ name: "user_id" })
    user: User;

    @Column()
    user_id: string;
}
