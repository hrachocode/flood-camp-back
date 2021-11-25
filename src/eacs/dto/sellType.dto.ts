import { IsNumber, IsOptional } from "class-validator";

export class SellType {
    @IsOptional()
    isAsk: boolean;
    @IsOptional()
    isAuction: boolean;
    @IsNumber()
    @IsOptional()
    price: number;

}