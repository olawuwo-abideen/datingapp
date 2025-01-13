import { Module } from '@nestjs/common';
<<<<<<< HEAD
import { ReportController } from './controllers/report.controller';
import { ReportService } from './services/report.service';
import { User } from 'src/shared-module/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from 'src/shared-module/entities/report.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([ User, Report]),
    ],
=======
import { ReportController } from './report.controller';
import { ReportService } from './report.service';

@Module({
>>>>>>> 21981fb5e1637d1fdf4cb3b2647d25c71f258d22
  controllers: [ReportController],
  providers: [ReportService]
})
export class ReportModule {}
