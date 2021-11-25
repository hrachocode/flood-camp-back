import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { EACs } from './dto/eacs.entity';
import { SellType } from './dto/sellType.dto';
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

    @Get('/auction')
    getAllAuctionEACs(@GetUser() user: User): Promise<EACs[]> {
        return this.eacsService.getAllAuctionEACs(user);
    }

    @Get('/ask')
    getAllAskEACs(@GetUser() user: User): Promise<EACs[]> {
        return this.eacsService.getAllAskEACs(user);
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

    @Patch('/eacsAskAuction/:id/')
    updateEACsAskAuction(@Param('id') id: number, @Body() sellTypeDto: SellType, @GetUser() user: User): Promise<EACs> {

        this.logger.verbose(`Updating  eacs by ID ${id}`);
        return this.eacsService.updateEACsAskAuction(id, sellTypeDto, user);

    }

    @Delete(':id')
    deleteEACs(@Param('id') id: number, @GetUser() user: User): Promise<void> {
        return this.eacsService.deleteEACs(id, user);
    }

}
