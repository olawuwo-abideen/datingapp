import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from 'src/shared-module/decorators/current-user.decorator';
import { User } from 'src/shared-module/entities/user.entity';
import { ReportService } from '../services/report.service';
import { IsValidUUIDPipe } from 'src/shared-module/pipes/is-valid-uuid.pipe';
import { ReportDto } from '../dto/report.dto';


@Controller('report')
export class ReportController {

constructor(
private readonly reportService:ReportService
){}

@Post('user/:id')
public async reportUser(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) reportedUserId: string,
@Body() data: ReportDto,
) {
return await this.reportService.reportUser(user, reportedUserId, data);
}


@Get('')
public async getUserReports(@CurrentUser() user: User) {
return await this.reportService.getUserReports(user.id);
}

@Post('block/:id')
public async blockUser(
  @Param('id', IsValidUUIDPipe) userId: string,
  @CurrentUser() user: User,
) {
  return await this.reportService.blockUser(user, userId);
}

@Post('unblock/:id')
public async unblockUser(
  @Param('id', IsValidUUIDPipe) userId: string,
  @CurrentUser() user: User, 
) {
  return await this.reportService.unblockUser(user, userId);
}

@Get('blocked-users')
public async getBlockedUsers(@CurrentUser() user: User) {
  return await this.reportService.getBlockedUsers(user);
}




}