import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EACsController } from './eacs.controller';
import { EACsRepository } from './eacs.repository';
import { EACsService } from './eacs.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([EACsRepository]),
    AuthModule
  ],
  controllers: [EACsController],
  providers: [EACsService]
})
export class EACsModule { }
