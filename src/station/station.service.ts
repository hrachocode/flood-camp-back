import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from './country.entity';
import { GetStationFilterDto } from './dto/get-station-filter.dto';
import { Region } from './region.entity';
import { EEnergyType } from './station-energyType.enum';
import { Station } from './station.entity';
import { CountryRepository, RegionRepository, StationRepository } from './station.repository';

@Injectable()
export class StationService {
    private logger = new Logger('StationService');

    constructor(
        @InjectRepository(StationRepository)
        private stationRepository: StationRepository,
        @InjectRepository(CountryRepository)
        private countryRepository: CountryRepository,
        @InjectRepository(RegionRepository)
        private regionRepository: RegionRepository) {}

    public async getAllStations(): Promise<Station[]> {

      //  const { energyType, search } = filterDto;

        const query = this.stationRepository.createQueryBuilder('station');

        // if (energyType) {
        //     query.andWhere('station.energyType = :energyType', { energyType })
        // }

        // if (search) {
        //     query.andWhere('station.name LIKE :search OR station.placement LIKE :search', { search: `%${search}%` })
        // }

        try {
            const stations = await query.getMany();

            return stations;
        } catch (error) {
            this.logger.error(`Failed to get all stations`, error.stack)
            throw new InternalServerErrorException();
        };


    }

    public async getStationById(id: number): Promise<Station> {

        const found = await this.stationRepository.findOne(id);

        if (!found) {
            this.logger.error(`Failed to get station by ID ${id}`)
            throw new NotFoundException(`Station with ${id} not found `);
        }

        return found;

    }



    public async createStation(stationInput: Station): Promise<Station> {

        let station = this.stationRepository.create(stationInput);

        try {

            await station.save();

        } catch (error) {

            this.logger.error(`Failed to create a station`, error.stack)
            throw new InternalServerErrorException();

        }

        return station;

    }


    public async deleteStation(id: number): Promise<void> {

        const result = await this.stationRepository.delete(id);

        if (result.affected === 0) {
            this.logger.error(`Failed to get station by ID ${id}`)
            throw new NotFoundException(`Station with ID "${id}" not found`)
        }

    }

    

    public async updateStationType(id: number, energyType: EEnergyType): Promise<Station> {

        const station = await this.getStationById(id);
        station.stationEnergyType = energyType;

        try {
            station.save();
        } catch (error) {
            this.logger.error(`Failed to update a station`, error.stack)
            throw new InternalServerErrorException();
        }

        return station;

    }


    public async createCountry(countryInput: Country): Promise<Country> {

        let country = this.countryRepository.create(countryInput);

        try {

            await country.save();

        } catch (error) {

            this.logger.error(`Failed to create a country`, error.stack)
            throw new InternalServerErrorException();

        }

        return country;

    }

    
    public async deleteCountry(id: number): Promise<void> {

        const result = await this.countryRepository.delete(id);

        if (result.affected === 0) {
            this.logger.error(`Failed to get country by ID ${id}`)
            throw new NotFoundException(`Country with ID "${id}" not found`)
        }

    }

    public async getCountryById(id: number): Promise<Country> {

        const found = await this.countryRepository.findOne(id);

        if (!found) {
            this.logger.error(`Failed to get Country by ID ${id}`)
            throw new NotFoundException(`Country with ${id} not found `);
        }

        return found;

    }

    public async getAllCountries(): Promise<Country[]> {


        const query = this.countryRepository.createQueryBuilder('Country');

        const countries = await query.getMany();

        return countries;
    }

    public async getAllRegions(): Promise<Region[]> {


        const query = this.regionRepository.createQueryBuilder('Region');

        const regions = await query.getMany();

        return regions;
    }

    public async createRegion(regionInput: Region): Promise<Region> {

        let region = this.regionRepository.create(regionInput);

        try {

            await region.save();

        } catch (error) {

            this.logger.error(`Failed to create a region`, error.stack)
            throw new InternalServerErrorException();

        }

        return region;

    }

    public async deleteRegion(id: number): Promise<void> {

        const result = await this.regionRepository.delete(id);

        if (result.affected === 0) {
            this.logger.error(`Failed to get Region by ID ${id}`)
            throw new NotFoundException(`Region with ID "${id}" not found`)
        }

    }

    public async getRegionById(id: number): Promise<Region> {

        const found = await this.regionRepository.findOne(id);

        if (!found) {
            this.logger.error(`Failed to get Region by ID ${id}`)
            throw new NotFoundException(`Region with ${id} not found `);
        }

        return found;

    }

}
