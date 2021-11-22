import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthCredentials } from './dto/auth-credentilas.dto';


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


}
