import { User } from "src/auth/user.entity";
import { Station } from "src/station/station.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";


@Unique(['userId'])
@Entity()
export class Organisation extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    registerNumber: string;

    @Column()
    userId: number

    @OneToMany(type => Station, station => station.organisation)
    stations: Station[];
}