import { NestFactory } from '@nestjs/core';
import { ReportModule } from './report.module';

async function bootstrap() {
  const app = await NestFactory.create(ReportModule);
  await app.listen(process.env.port ?? 3000);
}
bootstrap();
