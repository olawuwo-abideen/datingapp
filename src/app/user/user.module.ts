import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../shared-module/entities/user.entity';
import { UserController } from './controllers/user.controller';
import { CloudinaryModule } from '../../shared-module/cloudinary/cloudinary.module';


=======
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../shared-module/entities/user.entity';
import { UserController } from './user.controller';
import { CloudinaryModule } from '../../shared-module/cloudinary/cloudinary.module';

>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    CloudinaryModule,
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
