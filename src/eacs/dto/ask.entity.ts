import { IsOptional } from "class-validator";
import { BaseEntity, Column, Entity, IsNull, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { EACs } from "./eacs.entity";

@Entity()
export class Ask extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => EACs, eacs => eacs.ask, { eager: false })
    eacs: EACs;

    @Column()
    eacsId: number;

    @Column()
    userId: number;

    @Column()
    userName: string;

    @Column()
    price: number;

    @Column('boolean', { default: false })
    isArchive: boolean;

    Ask(eacsId: number, userId: number, userName: string, price: number,isArchive: boolean) {
        this.eacsId = eacsId;
        this.userId = userId;
        this.userName = userName;
        this.price = price;
        this.isArchive = isArchive;
    }

}