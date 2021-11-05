import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { OrganisationRepository } from './organisation.repository';
import { OrganisationController } from './organisation.controller';
import { OrganisationService } from './organisation.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrganisationRepository]),
    AuthModule
  ],
  controllers: [OrganisationController],
  providers: [OrganisationService]
})
export class OrganisationModule {}
