import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Station } from "./station.entity";

@Entity()
export class Country extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;

    @OneToMany(() =>Station, station =>station.country,{eager:true})
    stations: Station[];
}