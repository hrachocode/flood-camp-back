import { Body, Controller, Delete, Get, Logger, Param, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { Organisation } from './dto/organisation.entity';
import { OrganisationService } from './organisation.service';

@Controller('organisation')
export class OrganisationController {
    private logger = new Logger('OrganisationController');

    constructor(private organisationService: OrganisationService) {

    }

    @Get()
    getAllOrganisations() : Promise<Organisation[]> {

        
        return  this.organisationService.getAllOrganisations();
    }

    @Get(':id')
    getOrganisationById(@Param('id') id : number): Promise<Organisation> {
        return this.organisationService.getOrganisationById(id);
    }


    @Post()
    @UsePipes(ValidationPipe)
    createOrganisation(@Body() createOrganisationDto : Organisation) : Promise<Organisation> {
             return this.organisationService.createOrganisation(createOrganisationDto);
    }

    @Delete(':id')
    deleteOrganisation(@Param('id') id : number) : Promise<void> {
        return  this.organisationService.deleteOrganisation(id);
    }
    

}

