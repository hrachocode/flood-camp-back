import { IsNumber, IsOptional } from "class-validator";

export class BindsTypeDto {

    @IsNumber()
    eacsId: number;

    @IsNumber()
    @IsOptional()
    price: number;
}