import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import { HttpExceptionFilter } from './shared-module/exceptions/http.exception'
import { HttpResponseInterceptor } from  './shared-module/interceptors/http-response.iinterceptor'
import {ValidationPipe} from './shared-module/pipes/validation.pipe'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // enable cors
  app.use(helmet()); 
  // enable cors
  app.enableCors();
  // compression for responses
  app.use(compression());

  app.useGlobalInterceptors(new HttpResponseInterceptor());

  // validation pipe
  app.useGlobalPipes(new ValidationPipe());

  // exception filters
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));

  const port = parseInt(String(process.env.PORT)) || 3000;

  await app.listen(port, '0.0.0.0');
}
bootstrap();



