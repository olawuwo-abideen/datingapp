import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/shared-module/entities/user.entity';
import { Report } from 'src/shared-module/entities/report.entity';

@Injectable()
export class ReportService {

  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
  ) {}













    public async getUserReports(user: User): Promise<Report[]> {
        return await this.reportRepository.find({
            where: { userId: user.id }, 
        });
      }
}
