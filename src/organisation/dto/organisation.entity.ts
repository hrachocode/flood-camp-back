import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Organisation extends BaseEntity{

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    name: string;
    @Column()
    registerNumber: string;
}