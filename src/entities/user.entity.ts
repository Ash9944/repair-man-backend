
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn, OneToMany, ManyToOne, JoinColumn, OneToOne, } from 'typeorm';
import { UserRoles } from './userRoles.entity';
import { Exclude } from 'class-transformer';
import { ProviderAddresses } from './providerAddress.entity';

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

    @ManyToOne(() => UserRoles, (userRoles) => userRoles.id)
    @JoinColumn({ name: "role_id" })
    roles: UserRoles;

    @Column({ nullable: true })
    role_id: string;

    @OneToMany(() => ProviderAddresses, (add) => add.user, { nullable: true })
    addresses: ProviderAddresses[];

    @Column({ nullable: true })
    gender: string;

    @Column({ nullable: true })
    dob: string;
}
