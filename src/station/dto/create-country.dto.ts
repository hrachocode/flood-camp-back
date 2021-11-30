import {  IsNotEmpty,  IsString, MaxLength } from "class-validator";
export class CreateCountryDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;
}