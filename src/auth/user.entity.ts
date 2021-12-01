import { BaseEntity, Column, Entity, IsNull, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique } from "typeorm";
import * as bcrypt from 'bcrypt';
import { EACs } from "src/eacs/dto/eacs.entity";
import { Organisation } from "src/organisation/dto/organisation.entity";
import { IsOptional } from "class-validator";

@Entity()
@Unique(['username'])
@Unique(['organisation'])
export class User extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;
    @Column()
    username: string;
    @Column()
    password: string;


    @IsOptional()
    
    @Column('numeric', {default: 0.0})
    balance: number;

    @Column()
    privateKey: string;

    @Column()
    salt: string;
    @OneToMany(type => EACs, eacs => eacs.user)
    eacs: EACs[];

    @OneToOne(() => Organisation, {eager:true})
    @JoinColumn()
    organisation : Organisation

    async validatePassword(password: string): Promise<boolean> {
        const hash = await bcrypt.hash(password, this.salt);
        return hash === this.password;
    }
}