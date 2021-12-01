import { User } from "src/auth/user.entity";
import { Station } from "src/station/station.entity";
import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Ask } from "./ask.entity";

@Entity()
export class EACs extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creationEnergyStartDate: Date;

  @Column()
  creationEnergyEndDate: Date;

  @Column()
  energyAmount: number;

  @Column()
  contractAddress: string;

  @Column()
  fromAddress: string;

  @Column()
  toAddress: string;

  @Column('boolean', { default: false })
  isArchive: boolean;

  @Column('boolean', { default: false })
  isAsk: boolean;

  @Column('double precision', { default: 0 })
  price: number;

  @OneToMany(type => Ask, ask => ask.eacs)
  ask: Ask[];

  @ManyToOne(type => User, user => user.eacs, { eager: false })
  user: User;
  @ManyToOne(type => Station, station => station.eacs, { eager: false })
  station: Station;

  @Column()
  userId: number;

}