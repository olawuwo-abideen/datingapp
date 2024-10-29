import { Controller, Get } from '@nestjs/common';
import { PreferencesService } from './preferences.service';

@Controller()
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  getHello(): string {
    return this.preferencesService.getHello();
  }
}
