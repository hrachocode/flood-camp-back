import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { EEnergyType } from "./station-energyType.enum";



@Entity()
export class Station extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    energyType : EEnergyType;
    @Column()
    placement: string;
    @Column()
    supportGovernment: string;
    @Column()
    exploitationStart: Date;
    @Column()
    countryId: number;
    @Column()
    regionId: number;
}