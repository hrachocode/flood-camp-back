import { ApiProperty } from "@nestjs/swagger";
import { IsString, Matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentials {

    @IsString()
    @MinLength(4)
    @MaxLength(40)
    @ApiProperty({example : 'testName'})
    username: string;

    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'password too weak' })
    @ApiProperty({example : '400107$Aa'})
    password: string;
}