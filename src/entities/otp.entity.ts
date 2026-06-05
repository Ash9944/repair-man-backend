import { Column, CreateDateColumn, Entity,PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Otp {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    code: string;

    @Column()
    user_id: string;

    @CreateDateColumn()
    created_at: Date;
}