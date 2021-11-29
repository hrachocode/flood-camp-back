import { User } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Organisation extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    registerNumber: string;

    @ManyToOne(type => User, user => user.organisations, { eager: false })
    user: User;

    @Column()
    userId: number
}