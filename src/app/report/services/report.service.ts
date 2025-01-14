import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
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
    const userReports = await this.reportRepository.find({
      where: { userId },
    });
    const transformedReports = userReports.map((report) => ({
      reportId: report.id,
      reason: report.reason,
      details: report.details,
      reportedUserId: report.reportId,
      userCreatingTheReport: report.userId,
    }));
    return {
      data: transformedReports,
    };
  }
  




  public async blockUser(
    user: User, 
    targetUserId: string,
  ): Promise<{ message: string }> {
    if (user.id === targetUserId) {
      throw new BadRequestException("You cannot block yourself.");
    }
    const targetUser = await this.userRepository.findOne({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new NotFoundException(`User with ID ${targetUserId} not found.`);
    }
    const existingReport = await this.reportRepository.findOne({
      where: { userId: user.id, blockedUserId: targetUserId },
    });

    if (existingReport) {
      throw new BadRequestException(`User with ID ${targetUserId} is already blocked.`);
    }
    await this.reportRepository.save({
      userId: user.id,
      blockedUserId: targetUserId,
      createdAt: new Date(),
    });

    return { message: `User with ID ${targetUserId} has been blocked.` };
  }

  public async unblockUser(
    user: User,
    targetUserId: string,
  ): Promise<{ message: string }> {
    if (user.id === targetUserId) {
      throw new BadRequestException("You cannot unblock yourself.");
    }
    const targetUser = await this.userRepository.findOne({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new NotFoundException(`User with ID ${targetUserId} not found.`);
    }
    const existingReport = await this.reportRepository.findOne({
      where: { userId: user.id, blockedUserId: targetUserId },
    });
  
    if (!existingReport) {
      throw new BadRequestException(`User with ID ${targetUserId} is not blocked.`);
    }
    await this.reportRepository.remove(existingReport);
  
    return { message: `User with ID ${targetUserId} has been unblocked.` };
  }


  async getBlockedUsers(user: User): Promise<any> {
    const reports = await this.reportRepository.find({
      where: {
        userId: user.id,
      },
    });
    if (reports.length === 0) {
      return { message: 'No users were blocked' }; 
    }
    const blockedUsers = reports
      .filter(report => report.blockedUserId) 
      .map(report => `blocked userId: ${report.blockedUserId}`);
    if (blockedUsers.length === 0) {
      return { message: 'No valid blocked users found' };
    }
  
    return {
      data: blockedUsers,
    };
  }

}






  
  



