import { IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateStationDto {

    @IsNotEmpty({ message: "Name should not be empty" })
    @IsString()
    @MaxLength(50, { message: "Name must be shorter than or equal to 50 characters" })
    name: string;

    @IsNotEmpty({ message: "Placement should not be empty" })
    @IsString()
    @MaxLength(50, { message: "Placement must be shorter than or equal to 50 characters" })
    placement: string;

    @IsNotEmpty({ message: "Government should not be empty" })
    @IsString()
    @MaxLength(80, { message: "Placement must be shorter than or equal to 80 characters" })
    supportGovernment: string;

    @IsNotEmpty({message : "Exploitation Start should not be empty"})
    exploitationStart: Date;

    @IsNotEmpty({message:"Country should not be empty"})
    countryId: number;

    @IsNotEmpty({message:"Region should not be empty"})
    regionId: number;

}