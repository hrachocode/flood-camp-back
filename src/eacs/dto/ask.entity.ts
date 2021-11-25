import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Ask extends BaseEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    eacsId: number;

    @Column()
    userId: number;

    @Column()
    price: number;

}