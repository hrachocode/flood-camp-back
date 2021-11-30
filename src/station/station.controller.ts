import { Body, Controller, Delete, Get, Logger, Param, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Country } from './country.entity';
import { Region } from './region.entity';
import { EEnergyType } from './station-energyType.enum';
import { Station } from './station.entity';
import { StationService } from './station.service'

@Controller('station')
@UseGuards(AuthGuard())
@ApiTags('Stations')
export class StationController {
    private logger = new Logger('StationController');
    constructor(private stationService: StationService) {

    }

    @Get('/region')
    getAllRegions(): Promise<Region[]> {
        return this.stationService.getAllRegions();
    }

    @Get('/country')
    getAllCountries(): Promise<Country[]> {
        return this.stationService.getAllCountries();
    }

    @Get()
    getAllStations(@GetUser() user: User): Promise<Station[]> {

        this.logger.verbose(`Retrieving all Stations`)
        return this.stationService.getAllStations(user);
    }

    @Get(':id')
    getStationById(@Param('id') id: number, @GetUser() user: User): Promise<Station> {
        this.logger.verbose(`Retrieving Station by ID   + ${id}`)
        return this.stationService.getStationById(id, user);
    }


    @Post()
    // @ApiBearerAuth('access-token')
    createStation(@Body(ValidationPipe) createStationDto: Station, @GetUser() user: User): Promise<Station> {

        this.logger.verbose(`Creating new Station. Data : ${JSON.stringify(createStationDto)}`);
        return this.stationService.createStation(createStationDto, user);
    }

    @Delete(':id')
    deleteStation(@Param('id') id: number, @GetUser() user: User): Promise<void> {
        this.logger.verbose(`Deleting Station by ID   + ${id}`)
        return this.stationService.deleteStation(id, user);
    }


    @Patch(':id/energyType')
    updateStationType(@Param('id') id: number, @Body('energyType') energyType: EEnergyType, @GetUser() user: User): Promise<Station> {
        this.logger.verbose(`Updating  StationType`)
        return this.stationService.updateStationType(id, energyType, user);
    }

    @Post('/country')
    createCountry(@Body(ValidationPipe) createCountryDto: Country): Promise<Country> {

        this.logger.verbose(`Creating new Country. Data : ${JSON.stringify(createCountryDto)}`);
        return this.stationService.createCountry(createCountryDto);
    }

    @Get('/country/:id')
    getCountryById(@Param('id') id: number): Promise<Country> {
        this.logger.verbose(`Retrieving Country by ID   + ${id}`)
        return this.stationService.getCountryById(id);
    }

    @Delete('/country/:id')
    deleteCountry(@Param('id') id: number): Promise<void> {
        console.log(id);
        this.logger.verbose(`Deleting Country by ID   + ${id}`)
        return this.stationService.deleteCountry(id);
    }


    @Post('/region')
    createRegion(@Body(ValidationPipe) createRegionDto: Region): Promise<Region> {

        this.logger.verbose(`Creating new region. Data : ${JSON.stringify(createRegionDto)}`);
        return this.stationService.createRegion(createRegionDto);
    }

    @Delete('/region/:id')
    deleteRegion(@Param('id') id: number): Promise<void> {
        console.log(id);
        this.logger.verbose(`Deleting Region by ID   + ${id}`)
        return this.stationService.deleteRegion(id);
    }

    @Get('/region/:id')
    getRegionById(@Param('id') id: number): Promise<Region> {
        this.logger.verbose(`Retrieving Region by ID   + ${id}`)
        return this.stationService.getRegionById(id);
    }



}
