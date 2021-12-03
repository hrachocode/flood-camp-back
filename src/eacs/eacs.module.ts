import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/auth.service';
import { StationModule } from 'src/station/station.module';
import { EACsController } from './eacs.controller';
import { AskRepository, EACsRepository } from './eacs.repository';
import { EACsService } from './eacs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EACsRepository,AskRepository]),
    AuthModule,
    StationModule,

  ],
  controllers: [EACsController],
  providers: [EACsService]
})
export class EACsModule { }

