import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { Organisation } from './dto/organisation.entity';
import { OrganisationRepository } from './organisation.repository';

@Injectable()
export class OrganisationService {
    private logger = new Logger('OrganisationService');

    constructor(@InjectRepository(OrganisationRepository)
    private organisationRepository: OrganisationRepository) { }

    public async getAllOrganisations(user: User): Promise<Organisation[]> {


        const query = this.organisationRepository.createQueryBuilder('Organisation');

        query.where('eacs.userId = :userId', { userId: user.id })

        const organisations = await query.getMany();

        return organisations;
    }

    public async getOrganisationById(id: number, user: User): Promise<Organisation> {

        const found = await this.organisationRepository.findOne({ where: { id, userId: user.id } });

        if (!found) {
            throw new NotFoundException(`Organisation with ${id} not found `);
        }

        return found;

    }

    public async createOrganisation(organisationInput: CreateOrganisationDto, user: User): Promise<Organisation> {

        let organisation = this.organisationRepository.create(organisationInput);

        organisation.user = user;

        await organisation.save();
        delete organisation.user;

        return organisation;

    }

    public async deleteOrganisation(id: number, user: User): Promise<void> {

        const result = await this.organisationRepository.delete({ id, userId: user.id });

        if (result.affected === 0) {
            throw new NotFoundException(`Organisation with ID "${id}" not found`)
        }

    }

}
