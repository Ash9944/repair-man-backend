import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Token {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    user_id: string;

    @Column()
    access_token: string;

    @CreateDateColumn()
    created_at: Date;

    @Column({ nullable: true })
    ip_address: string;

    @Column({ nullable: true })
    user_agent: string;

    @Column({ nullable: true })
    refresh_token: string;

    @Column({ nullable: true })
    refresh_token_expires_at: Date;
}