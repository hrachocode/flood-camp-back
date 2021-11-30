import { IsNotEmpty, IsString, MaxLength } from "class-validator";
export class CreateRegionDto {

    @IsNotEmpty()
    @IsString()
    @MaxLength(100)
    name: string;
}