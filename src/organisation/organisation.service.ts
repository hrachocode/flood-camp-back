import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organisation } from './dto/organisation.entity';
import { OrganisationRepository } from './organisation.repository';

@Injectable()
export class OrganisationService {
    private logger = new Logger('OrganisationService');

    constructor(@InjectRepository(OrganisationRepository)
    private organisationRepository: OrganisationRepository) { }

    public async getAllOrganisations(): Promise<Organisation[]> {


        const query = this.organisationRepository.createQueryBuilder('Organisation');

        const organisations = await query.getMany();

        return organisations;
    }

    public async getOrganisationById(id: number): Promise<Organisation> {

        const found = await this.organisationRepository.findOne(id);

        if (!found) {
            throw new NotFoundException(`Organisation with ${id} not found `);
        }

        return found;

    }

    public async createOrganisation(OrganisationInput: Organisation): Promise<Organisation> {

        let organisation = this.organisationRepository.create(OrganisationInput);

        await organisation.save();

        return organisation;

    }

    public async deleteOrganisation(id: number): Promise<void> {

        const result = await this.organisationRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Organisation with ID "${id}" not found`)
        }

    }

}
