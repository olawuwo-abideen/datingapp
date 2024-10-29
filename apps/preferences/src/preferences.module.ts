import { Module } from '@nestjs/common';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';

@Module({
  imports: [],
  controllers: [PreferencesController],
  providers: [PreferencesService],
})
export class PreferencesModule {}
