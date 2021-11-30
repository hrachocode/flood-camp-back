import { IsDate, IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";

export class CreateStationDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(80)
    placement: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(80)
    supportGovernment: string;

    @IsNotEmpty()
    @IsDate()
    exploitationStart: Date;

    @IsNotEmpty()
    @IsNumber()
    countryId: number;

    @IsNotEmpty()
    @IsNumber()
    regionId: number;

}