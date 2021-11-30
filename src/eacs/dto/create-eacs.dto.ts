import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class CreateEACsDto {

    @IsNotEmpty({message : "Energy Start Date should not be empty"})
    creationEnergyStartDate: Date;

    @IsNotEmpty({message : "Energy End Date should not be empty"})
    creationEnergyEndDate: Date;

    @IsNotEmpty({message : "Energy Amount should not be empty"})
    @IsNumber()
    energyAmount: number;

}