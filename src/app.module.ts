import { Module } from '@nestjs/common';
import { StationModule } from './station/station.module';
import { OrganizationModule } from './organization/organization.module';
import { EacsModule } from './eacs/eacs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';


@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), StationModule, OrganizationModule, EacsModule],
})
export class AppModule { }
