import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { User } from 'src/shared-module/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([ User]),
  ],
=======
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22
  controllers: [AdminController],
  providers: [AdminService]
})
export class AdminModule {}
