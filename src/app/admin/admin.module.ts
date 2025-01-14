import { Module } from '@nestjs/common';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { User } from 'src/shared-module/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from 'src/shared-module/entities/report.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Report]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
