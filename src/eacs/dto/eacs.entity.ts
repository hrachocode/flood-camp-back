import { User } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

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
  isAuction: boolean;

  @Column('boolean', { default: false })
  isAsk: boolean;

  @Column('double precision', { default: 0 })
  price: number;

  @ManyToOne(type => User, user => user.eacs, { eager: false })
  user: User;

  @Column()
  userId: number;

}