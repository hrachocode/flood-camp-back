import { Body, Controller, Get, Param, ParseFloatPipe, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentials } from './dto/auth-credentilas.dto';
import { GetUser } from './get-user.decorator';
import { User } from './user.entity';


@Controller('auth')
@ApiTags('Authantication')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentialsDto: AuthCredentials): Promise<void> {
        return this.authService.signUp(authCredentialsDto);

    }

    @Post('/signIn')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentials): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialsDto);
    }

    @Patch('/updateBalance/:id/')
    @UsePipes(ValidationPipe)
    updateUserBalance(@Param('id') id: number, @Body('balance', ParseFloatPipe)  balance: number): Promise<User> {

        return this.authService.updateUserBalance(id, balance);

    }

    @UseGuards(AuthGuard())
    @Get('/userBalance/')
    getUserBalanceById(@GetUser() user: User): Promise<number> {
        return this.authService.getUserBalance(user);
    }

}
