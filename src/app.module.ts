import { Module } from '@nestjs/common';
import { StationModule } from './station/station.module';
import { OrganisationModule } from './organisation/organisation.module';
import { EACsModule } from './eacs/eacs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { AuthModule } from './auth/auth.module';


@Module({
  imports: [TypeOrmModule.forRoot(typeOrmConfig), StationModule, OrganisationModule, EACsModule, AuthModule],
})
export class AppModule { }
