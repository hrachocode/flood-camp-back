import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EACs } from './dto/eacs.entity';
import { EACsRepository } from './eacs.repository';

@Injectable()
export class EACsService {

    private logger = new Logger('EACsService');

    constructor(@InjectRepository(EACsRepository)
    private eacsRepository: EACsRepository) { }

    public async getAllEACs(): Promise<EACs[]> {


        const query = this.eacsRepository.createQueryBuilder('EACs');

        const eacs = await query.getMany();

        return eacs;
    }

    public async getEACsById(id: number): Promise<EACs> {

        const found = await this.eacsRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`EACs with ${id} not found `);
        }

        return found;

    }

    public async createEACs(eacsInput: EACs): Promise<EACs> {

        let eacs = this.eacsRepository.create(eacsInput);

        await eacs.save();

        return eacs;

    }

    public async deleteEACs(id: number): Promise<void> {

        const result = await this.eacsRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`EACs with ID "${id}" not found`)
        }

    }
}
