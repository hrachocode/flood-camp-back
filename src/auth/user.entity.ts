import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcrypt';
import { EACs } from "src/eacs/dto/eacs.entity";
import { Station } from "src/station/station.entity";
import { Organisation } from "src/organisation/dto/organisation.entity";

@Entity()
@Unique(['username'])
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    username: string;
    @Column()
    password: string;

    // @Column()
    // address: string;
    @Column()
    privateKey: string;

    @Column()
    salt: string;
    @OneToMany(type => EACs, eacs => eacs.user)
    eacs: EACs[];

    @OneToMany(type => Station, station => station.user)
    stations: Station[];

    @OneToMany(type => Organisation, organisation => organisation.user)
    organisations: Organisation[];

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}