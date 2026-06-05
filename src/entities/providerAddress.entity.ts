import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class ProviderAddresses {
    @PrimaryColumn('uuid')
    id: string;

    @ManyToOne(() => User, (user) => user.addresses)
    @JoinColumn({ name: "user_id" })
    user : User;

    @Column({ nullable: true })
    user_id: string;

    @Column()
    address_line1: string;

    @Column({ nullable: true })
    address_line2: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    postal_code: string;

    // Use "geography" type for Earth-based distances
    @Column({
        type: 'geography',
        spatialFeatureType: 'Point',
        srid: 4326,
    })
    location: string; // Will hold POINT(lon lat)

}