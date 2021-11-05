import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class EACs extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    creationEnergyStartDate: Date;
    @Column()
    creationEnergyEndDate: Date;
    @Column()
    energyAmount : number
}