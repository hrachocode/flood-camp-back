import { IsDate, IsNotEmpty, IsNumber } from "class-validator";

export class CreateEACsDto {

    @IsNotEmpty()
    creationEnergyStartDate: Date;

    @IsNotEmpty()
    creationEnergyEndDate: Date;

    @IsNotEmpty()
    @IsNumber()
    energyAmount: number;

}