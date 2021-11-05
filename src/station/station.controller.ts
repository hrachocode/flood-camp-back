import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetStationFilterDto } from './dto/get-station-filter.dto';
import { EEnergyType } from './station-energyType.enum';
import { Station } from './station.entity';
import { StationService } from './station.service'

@Controller('station')
@UseGuards(AuthGuard())
export class StationController {

    constructor(private stationService: StationService) {

    }

    @Get()
    getAllStations(@Query()filterDto : GetStationFilterDto) : Promise<Station[]> {

        
        return  this.stationService.getAllStations(filterDto);
    }

    @Get(':id')
    getStationById(@Param('id') id : number): Promise<Station> {
        return this.stationService.getStationById(id);
    }


    @Post()
    @UsePipes(ValidationPipe)
    createStation(@Body() createStationDto : Station) : Promise<Station> {
             return this.stationService.createStation(createStationDto);
    }

    @Delete(':id')
    deleteStation(@Param('id') id : number) : Promise<void> {
        return  this.stationService.deleteStation(id);
    }
    

    @Patch(':id/energyType')
    updateStationType(@Param('id') id : number, @Body('energyType') energyType : EEnergyType ): Promise<Station> {
        return this.stationService.updateStationType(id,energyType);
    }
   

}
