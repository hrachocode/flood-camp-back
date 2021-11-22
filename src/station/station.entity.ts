import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Country } from "./country.entity";
import { Region } from "./region.entity";
import { EEnergyType } from "./station-energyType.enum";



@Entity()
export class Station extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({ example: 'testName' })
    @Column()
    name: string;
    @Column()
    @ApiProperty({ example: EEnergyType.SOLAR })
    stationEnergyType: EEnergyType;
    @Column()
    @ApiProperty({ example: 'testplacements' })
    placement: string;
    @Column()
    @ApiProperty({ example: 'testpsupport' })
    supportGovernment: string;
    @Column()
    @ApiProperty({ example: new Date().toISOString() })
    exploitationStart: Date;
    @ApiProperty({ example: 1 })
    @Column()
    countryId: Number;
    @ApiProperty({ example: 1 })
    @Column()
    regionId: Number;
    @ManyToOne(type => User, user => user.stations, { eager: false })
    user: User;
    @Column()
    userId: number
}