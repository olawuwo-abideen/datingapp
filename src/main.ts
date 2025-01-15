import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import { HttpExceptionFilter } from './shared-module/exceptions/http.exception'
import { HttpResponseInterceptor } from  './shared-module/interceptors/http-response.iinterceptor'
import {ValidationPipe} from './shared-module/pipes/validation.pipe'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  app.use(helmet()); 
  app.enableCors();
  app.use(compression());
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));

  const port = parseInt(String(process.env.PORT)) || 3000;

  const config = new DocumentBuilder()
  .setTitle('Median')
  .setDescription('The Median API description')
  .setVersion('0.1')
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port, '0.0.0.0');
}
bootstrap();



