
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn, OneToOne, } from 'typeorm';
import { UserRoles } from './userRoles.entity';
import { Exclude } from 'class-transformer';
import { ProviderAddresses } from './providerAddress.entity';
import { ShopDetails } from './shopDetails.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    firstName: string;

    @Column({ nullable: true })
    lastName: string;

    @Column({ unique: true, nullable: true })
    email: string;

    @Column({ nullable: true })
    @Exclude()
    password: string;

    @Column({ default: '+91' })
    country_code: string;

    @Column({ unique: true })
    mobile: string;

    @CreateDateColumn()
    created_at: Date;

    @Column({ nullable: true })
    updated_at: Date;

    @DeleteDateColumn({ nullable: true })
    deleted_at?: Date;

    @ManyToOne(() => UserRoles, (userRoles) => userRoles.users, { nullable: true })
    @JoinColumn({ name: "role_id" })
    roles: UserRoles;

    @Column({ nullable: true })
    role_id: string;

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    dob: string;

    @Column({ nullable: true })
    profile_image: string;

    @Column({ nullable: true })
    is_active: boolean;

    @Column({ nullable: true })
    is_verified: boolean;

    @OneToMany(() => ShopDetails, (shopDetails) => shopDetails.user, { nullable: true })
    shopDetails: ShopDetails[];
}
