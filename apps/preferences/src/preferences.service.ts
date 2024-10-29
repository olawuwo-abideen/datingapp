import { Injectable } from '@nestjs/common';

@Injectable()
export class PreferencesService {
  getHello(): string {
    return 'Hello World!';
  }
}
