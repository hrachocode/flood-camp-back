import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./country.entity";
import { Region } from "./region.entity";
import { EEnergyType } from "./station-energyType.enum";



@Entity()
export class Station extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    stationEnergyType : EEnergyType;
    @Column()
    placement: string;
    @Column()
    supportGovernment: string;
    @Column()
    exploitationStart: Date;
    @Column()
    countryId: Number;
    @Column()
    regionId: Number;
}