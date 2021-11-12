import { Body, Controller, Delete, Get, Logger, Param, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { EACs } from './dto/eacs.entity';
import { EACsService } from './eacs.service';

@Controller('eacs')
export class EACsController {
    private logger = new Logger('EACsController');

    constructor(private eacsService: EACsService) {

    }

    @Get()
    getAllEACs(): Promise<EACs[]> {
        return this.eacsService.getAllEACs();
    }

    @Get(':id')
    getEACsById(@Param('id') id: number): Promise<EACs> {
        return this.eacsService.getEACsById(id);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createEACs(@Body() createEACsDto: EACs): Promise<EACs> {
        return this.eacsService.createEACs(createEACsDto);
    }

    @Delete(':id')
    deleteEACs(@Param('id') id: number): Promise<void> {
        return this.eacsService.deleteEACs(id);
    }
}
