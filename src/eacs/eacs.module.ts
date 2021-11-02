import { Module } from '@nestjs/common';
import { EacsController } from './eacs.controller';
import { EacsService } from './eacs.service';

@Module({
  controllers: [EacsController],
  providers: [EacsService]
})
export class EacsModule {}
