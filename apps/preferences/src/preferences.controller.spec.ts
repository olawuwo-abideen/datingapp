import { Test, TestingModule } from '@nestjs/testing';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';

describe('PreferencesController', () => {
  let preferencesController: PreferencesController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PreferencesController],
      providers: [PreferencesService],
    }).compile();

    preferencesController = app.get<PreferencesController>(PreferencesController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(preferencesController.getHello()).toBe('Hello World!');
    });
  });
});
