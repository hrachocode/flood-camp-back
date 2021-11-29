import { IsNumber, IsOptional } from "class-validator";

export class BindsType {

    @IsNumber()
    eacsId: number;

    @IsNumber()
    @IsOptional()
    price: number;
}