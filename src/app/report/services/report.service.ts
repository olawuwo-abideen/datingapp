import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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
  




  public async blockUser(
    user: User, // Entire user object injected via @CurrentUser
    targetUserId: string,
  ): Promise<{ message: string }> {
    if (user.id === targetUserId) {
      throw new BadRequestException("You cannot block yourself.");
    }

    // Check if the target user exists
    const targetUser = await this.userRepository.findOne({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new NotFoundException(`User with ID ${targetUserId} not found.`);
    }

    // Check if the user has already been blocked
    const existingReport = await this.reportRepository.findOne({
      where: { userId: user.id, blockedUserId: targetUserId },
    });

    if (existingReport) {
      throw new BadRequestException(`User with ID ${targetUserId} is already blocked.`);
    }

    // Create a block report
    await this.reportRepository.save({
      userId: user.id,
      blockedUserId: targetUserId,
      createdAt: new Date(),
    });

    return { message: `User with ID ${targetUserId} has been blocked.` };
  }

  public async unblockUser(
    user: User, // Entire user object injected via @CurrentUser
    targetUserId: string,
  ): Promise<{ message: string }> {
    if (user.id === targetUserId) {
      throw new BadRequestException("You cannot unblock yourself.");
    }
  
    // Check if the target user exists
    const targetUser = await this.userRepository.findOne({ where: { id: targetUserId } });
    if (!targetUser) {
      throw new NotFoundException(`User with ID ${targetUserId} not found.`);
    }
  
    // Check if a block exists
    const existingReport = await this.reportRepository.findOne({
      where: { userId: user.id, blockedUserId: targetUserId },
    });
  
    if (!existingReport) {
      throw new BadRequestException(`User with ID ${targetUserId} is not blocked.`);
    }
  
    // Remove the block report
    await this.reportRepository.remove(existingReport);
  
    return { message: `User with ID ${targetUserId} has been unblocked.` };
  }


  // public async getBlockedUsers(user: User): Promise<{ blockedUsers: any[] }> {
  //   // Retrieve all blocked users for the authenticated user
  //   const blockedUsers = await this.reportRepository.find({
  //     where: { userId: user.id },
  //     relations: ['blockedUser'], // Ensure you load the related blockedUser entity
  //   });
  
  //   // Map blocked user details into a cleaner format
  //   const blockedUserDetails = blockedUsers.map(report => ({
  //     id: report.blockedUser.id
  //   }));
  
  //   return { blockedUsers: blockedUserDetails };
  // }
  
  

}

