import { User } from "src/auth/user.entity";
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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

  @ManyToOne(type => User, user => user.eacs, { eager: false })
  user: User;

  @Column()
  userId: number
}