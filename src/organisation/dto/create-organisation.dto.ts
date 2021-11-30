import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateOrganisationDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    name: string;

    @IsNotEmpty()
    @IsString()
    @MaxLength(50)
    registerNumber: string;

}