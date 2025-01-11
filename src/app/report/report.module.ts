import { Module } from '@nestjs/common';
import { ReportController } from './controllers/report.controller';
import { ReportService } from './services/report.service';
import { User } from 'src/shared-module/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Report } from 'src/shared-module/entities/report.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([ User, Report]),
    ],
  controllers: [ReportController],
  providers: [ReportService]
})
export class ReportModule {}
