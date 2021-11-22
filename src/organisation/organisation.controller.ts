import { Body, Controller, Delete, Get, Logger, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { Organisation } from './dto/organisation.entity';
import { OrganisationService } from './organisation.service';

@Controller('organisation')
@ApiTags('Organisation')
export class OrganisationController {
    private logger = new Logger('OrganisationController');

    constructor(private organisationService: OrganisationService) {

    }

    @Get()
    getAllOrganisations(@GetUser() user: User): Promise<Organisation[]> {

        return this.organisationService.getAllOrganisations(user);
    }

    @Get(':id')
    getOrganisationById(@Param('id') id: number, @GetUser() user: User): Promise<Organisation> {
        return this.organisationService.getOrganisationById(id, user);
    }


    @Post()
    @UsePipes(ValidationPipe)
    createOrganisation(@Body() createOrganisationDto: Organisation, @GetUser() user: User): Promise<Organisation> {
        return this.organisationService.createOrganisation(createOrganisationDto, user);
    }

    @Delete(':id')
    deleteOrganisation(@Param('id') id: number, @GetUser() user: User): Promise<void> {
        return this.organisationService.deleteOrganisation(id, user);
    }


}

