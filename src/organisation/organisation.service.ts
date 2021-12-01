import { ConflictException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { UserRepository } from 'src/auth/user.repository';
import { CreateOrganisationDto } from './dto/create-organisation.dto';
import { Organisation } from './dto/organisation.entity';
import { OrganisationRepository } from './organisation.repository';

@Injectable()
export class OrganisationService {
    private logger = new Logger('OrganisationService');

    constructor(@InjectRepository(UserRepository)
    private userRepository: UserRepository, @InjectRepository(OrganisationRepository,)
        private organisationRepository: OrganisationRepository) { }

    public async getAllOrganisations(user: User): Promise<Organisation[]> {


        const query = this.organisationRepository.createQueryBuilder('organisation');

        query.where('organisation.userId = :userId', { userId: user.id })

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

        organisation.userId = user.id;

        try {
            await organisation.save();
        } catch (error) {

            if (error.code === '23505') {//duplicate in organisation userId
                throw new ConflictException(`User must be have one organisation`);
            }
            else {
                console.log(error);
                console.log(error.stack);

                throw new InternalServerErrorException("Organisation don't save");
            }
        }

        let curentUser = await this.userRepository.getUserById(user.id);

        curentUser.organisation = organisation;
        await curentUser.save()

        return organisation;

    }

    public async deleteOrganisation(id: number, user: User): Promise<void> {
  
        
        let curentUser = await this.userRepository.getUserById(user.id);

        curentUser.organisation = null;
         await curentUser.save()
        const result = await this.organisationRepository.delete(id);

        if (result.affected === 0) {
            throw new NotFoundException(`Organisation with ID "${id}" not found`)
        }

    }

}
