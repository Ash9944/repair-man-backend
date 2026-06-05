import { Column, CreateDateColumn, Entity, OneToMany, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class UserRoles {
    @PrimaryColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @CreateDateColumn()
    created_at: Date;

    @Column()
    key: string;

    @OneToMany(() => User, (user) => user.roles)
    users: User[];
}