import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentials {

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    @MaxLength(40)
    @ApiProperty({example : 'testName'})
    username: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    @ApiProperty({example : '400107$Aa'})
    password: string;

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    balance : number;
}