import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { StationController } from './station.controller';
import { StationRepository } from './station.repository';
import { StationService } from './station.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([StationRepository]),
    AuthModule
  ],
  controllers: [StationController],
  providers: [StationService]
})
export class StationModule { }
