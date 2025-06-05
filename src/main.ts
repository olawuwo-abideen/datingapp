import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import helmet from 'helmet';
import * as compression from 'compression';
import * as cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './shared-module/exceptions/http.exception'
import { HttpResponseInterceptor } from  './shared-module/interceptors/http-response.interceptor'
import {ValidationPipe} from './shared-module/pipes/validation.pipe'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
        
  });
  
  app.use(compression());
  app.use(cookieParser());   
  app.useGlobalInterceptors(new HttpResponseInterceptor());
  app.useGlobalPipes(new ValidationPipe());
  
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));

  const port = parseInt(String(process.env.PORT)) || 3000;

  const config = new DocumentBuilder()
  .setTitle('Dating App')
  .setDescription('A Dating app backend')
  .setVersion('1.0')
  .addBearerAuth()
  .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("docs", app, document, {
    customSiteTitle: "Api Docs",
    customfavIcon: "https://avatars.githubusercontent.com/u/6936373?s=200&v=4",
    customJs: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js",
    ],
    customCssUrl: [
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.css",
    ],
    swaggerOptions: {
      persistAuthorization: true,
    },
    
  });

  app.use(helmet())
  app.getHttpAdapter().get('/', (_, res) => {
    res.redirect('/docs');
  });

  await app.listen(port, '0.0.0.0');
}
bootstrap();



