import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
<<<<<<< HEAD
import { isDevelopement } from '../../utils/helpers.util';
=======
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    let synchronize = false;

<<<<<<< HEAD
    if (isDevelopement()) {
      synchronize = true;
    }
=======
    // if (isDevelopement()) {
    //   synchronize = true;
    // }
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22

    return {
      type: 'mysql',
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      username: this.configService.get<string>('DB_USERNAME'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
      autoLoadEntities: true,
<<<<<<< HEAD
      synchronize
=======
      synchronize,
      // entities: [
      //   User,
      //   Payment,
      //   // __dirname + '../../entities/**/*.entity.ts'
      // ],
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22
    };
  }
}
