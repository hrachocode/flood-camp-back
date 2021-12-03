import { Body, Controller, Param, ParseFloatPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentials } from './dto/auth-credentilas.dto';
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

}
