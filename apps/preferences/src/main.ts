import { NestFactory } from '@nestjs/core';
import { PreferencesModule } from './preferences.module';

async function bootstrap() {
  const app = await NestFactory.create(PreferencesModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
