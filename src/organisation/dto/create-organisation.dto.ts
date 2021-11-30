import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateOrganisationDto {

    @IsNotEmpty({message : "Name should not be empty"})
    @IsString()
    @MaxLength(50,{message:"Name must be shorter than or equal to 50 characters"})
    name: string;

    @IsNotEmpty({message : "Register Number should not be empty"})
    @IsString()
    @MaxLength(50,{message:"Register Number must be shorter than or equal to 50 characters"})
    registerNumber: string;

}