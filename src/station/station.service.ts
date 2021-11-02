import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetStationFilterDto } from './dto/get-station-filter.dto';
import { EEnergyType } from './station-energyType.enum';
import { Station } from './station.entity';
import { StationRepository } from './station.repository';

@Injectable()
export class StationService {


    constructor(
        @InjectRepository(StationRepository)
        private stationRepository: StationRepository) {

    }

    public async getAllStations(filterDto: GetStationFilterDto): Promise<Station[]> {

        const { energyType, search } = filterDto;

        const query = this.stationRepository.createQueryBuilder('station');

        if (energyType) {
            query.andWhere('station.energyType = :energyType', { energyType })
        }

        if (search) {
            query.andWhere('station.name LIKE :search OR station.placement LIKE :search', { search : `%${search}%` })
        }


        const stations = await query.getMany();

        return stations;
    }


    public async getStationById(id: number): Promise<Station> {

        const found = await this.stationRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Station with ${id} not found `);
        }

        return found;

    }



    public async createStation(stationInput: Station): Promise<Station> {

        let station = this.stationRepository.create(stationInput);

        await station.save();

        return station;

    }


    public async deleteStation(id: number): Promise<void> {

        const result = await this.stationRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Station with ID "${id}" not found`)
        }

    }


    public async updateStationType(id: number, energyType: EEnergyType): Promise<Station> {

        const station = await this.getStationById(id);
        station.energyType = energyType;
        station.save();
        return station;

    }

}
