import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Ask } from './dto/ask.entity';
import { BindsType } from './dto/bindsType.dto';
import { CreateEACsDto } from './dto/create-eacs.dto';
import { EACs } from './dto/eacs.entity';
import { IsAskDto } from './dto/isAsk.dto';
import { EACsService } from './eacs.service';

@Controller('eacs')
@UseGuards(AuthGuard())
@ApiTags('EACs')
export class EACsController {

    private logger = new Logger('EACsController');

    constructor(private eacsService: EACsService) {

    }
    @ApiBearerAuth()

    @Get()
    getAllEACs(@GetUser() user: User): Promise<EACs[]> {
        return this.eacsService.getAllEACs(user);
    }

    // @Get('/auction')
    // getAllAuctionEACs(@GetUser() user: User): Promise<EACs[]> {
    //     return this.eacsService.getAllAuctionEACs(user);
    // }

    @Get('/ask')
    getAllAskEACs(@GetUser() user: User): Promise<EACs[]> {
        return this.eacsService.getAllAskEACs(user);
    }

    @Get(':id')
    getEACsById(@Param('id') id: number, @GetUser() user: User): Promise<EACs> {
        return this.eacsService.getEACsById(id, user);
    }

    @Post()
    createEACs(@Body(ValidationPipe) createEACsDto: CreateEACsDto, @GetUser() user: User): Promise<EACs> {

        return this.eacsService.createEACs(createEACsDto, user);
    }

    @Post('/eacsBind/')
    @UsePipes(ValidationPipe)
    bindAskEACs(@Body() bindsType: BindsType, @GetUser() user: User): Promise<Ask> {

        return this.eacsService.bindAskEACs(bindsType, user);
    }

    @Patch('/eacsAsk/:id/')
    @UsePipes(ValidationPipe)
    updateEACsAsk(@Param('id') id: number, @Body() isAskDto: IsAskDto, @GetUser() user: User): Promise<EACs> {

        this.logger.verbose(`Updating  eacs by ID ${id}`);
        return this.eacsService.updateEACsAsk(id, isAskDto, user);

    }


    @Get('/bindEACs/:id')
    getBindEACsById(@Param('id') id: number, @GetUser() user: User): Promise<Ask[]> {
        return this.eacsService.getBindEACsById(id, user);
    }

    @Delete(':id')
    deleteEACs(@Param('id') id: number, @GetUser() user: User): Promise<void> {
        return this.eacsService.deleteEACs(id, user);
    }

    @Patch('/confirmAskEACs/:id/')

    @UsePipes(ValidationPipe)

    confirmAskEACs(@Param('id') id: number, @GetUser() user: User): Promise<EACs> {

        this.logger.verbose(`Confirm  ask by  ID ${id}`);
        return this.eacsService.confirmAskEACs(id, user);

    }

    @Get('/ask/:id')
    getAskById(@Param('id') id: number, @GetUser() user: User): Promise<Ask> {
        return this.eacsService.getAskById(id);
    }


}
