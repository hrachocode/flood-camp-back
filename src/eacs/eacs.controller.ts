import { Body, Controller, Delete, Get, Logger, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { EACs } from './dto/eacs.entity';
import { EACsService } from './eacs.service';

@Controller('eacs')
@UseGuards(AuthGuard())
@ApiTags('EACs')
export class EACsController {
    private logger = new Logger('EACsController');

    constructor(private eacsService: EACsService) {

    }

    @Get()
    getAllEACs(@GetUser() user: User): Promise<EACs[]> {
        return this.eacsService.getAllEACs(user);
    }

    @Get(':id')
    getEACsById(@Param('id') id: number, @GetUser() user: User): Promise<EACs> {
        return this.eacsService.getEACsById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createEACs(@Body() createEACsDto: EACs, @GetUser() user: User): Promise<EACs> {

        return this.eacsService.createEACs(createEACsDto, user);
    }

    @Delete(':id')
    deleteEACs(@Param('id') id: number, @GetUser() user: User): Promise<void> {
        return this.eacsService.deleteEACs(id, user);
    }
}
