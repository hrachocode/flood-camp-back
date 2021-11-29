import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class IsAskDto {
    @IsOptional()
    @IsBoolean()
    isAsk: boolean;

    @IsNumber()
    @IsOptional()
    price: number;

}