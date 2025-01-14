import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/shared-module/entities/user.entity';
import { Report } from 'src/shared-module/entities/report.entity';
import { ReportDto } from '../dto/report.dto';

@Injectable()
export class ReportService {

  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}


  
  public async reportUser(
    user: User,
    reportedUserId: string,
    data: ReportDto,
  ): Promise<any> {

    const reportedUser: User | null = await this.userRepository.findOne({
      where: { id: reportedUserId },
    });
  
    if (!reportedUser) {
      throw new NotFoundException('The user being reported does not exist');
    }
    const reportData = {
      userId: user.id,
      reportId: reportedUserId,
      reason: data.reason,
      details: data.details,
    };
  
    const report: Report = this.reportRepository.create(reportData);
    await this.reportRepository.save(report);
  
    return {
      message: 'Report submitted successfully',
      data: {
        reportId: report.id,
        reason: report.reason,
        details: report.details,
        reportedUserId: report.reportId,
        userCreatingTheReport: report.userId,
      },
    };
  }
  


  public async getUserReports(userId: string): Promise<any> {
    // Retrieve all reports created by the specific user
    const userReports = await this.reportRepository.find({
      where: { userId },
    });
  
    // Transform each report to the desired format
    const transformedReports = userReports.map((report) => ({
      reportId: report.id,
      reason: report.reason,
      details: report.details,
      reportedUserId: report.reportId,
      userCreatingTheReport: report.userId,
    }));
  
    // Return the transformed reports
    return {
      data: transformedReports,
    };
  }
  
}
