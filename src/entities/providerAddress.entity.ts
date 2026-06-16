import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { ShopDetails } from "./shopDetails.entity";

@Entity()
export class ProviderAddresses {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => ShopDetails, (shop) => shop.shopAddress)
    @JoinColumn({ name: "shop_id" })
    shop: ShopDetails;

    @Column({ nullable: true })
    shop_id: string;

    @Column()
    address_line1: string;

    @Column({ nullable: true })
    address_line2: string;

    @Column()
    city: string;

    @Column()
    area: string;

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