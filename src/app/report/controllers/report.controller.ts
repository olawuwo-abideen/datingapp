import { Body, Controller, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from 'src/shared-module/decorators/current-user.decorator';
import { User } from 'src/shared-module/entities/user.entity';
import { ReportService } from '../services/report.service';
import { IsValidUUIDPipe } from 'src/shared-module/pipes/is-valid-uuid.pipe';
import { ReportDto } from '../dto/report.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('report')
@Controller('report')
export class ReportController {

constructor(
private readonly reportService:ReportService
){}

@Post('user/:id')
  @ApiOperation({ summary: 'Report a user' })
  @ApiBody({ type: ReportDto, description: 'Report a user' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description:
      'Report created successfully.',
  })
public async reportUser(
@CurrentUser() user: User,
@Param('id', IsValidUUIDPipe) reportedUserId: string,
@Body() data: ReportDto,
) {
return await this.reportService.reportUser(user, reportedUserId, data);
}


@Get('')
@ApiOperation({ summary: 'Get user report.' })
@ApiResponse({
  status: HttpStatus.OK,
  description:
    'Report retrieve successfully.',
})
public async getUserReports(@CurrentUser() user: User) {
return await this.reportService.getUserReports(user.id);
}

@Post('block/:id')
@ApiOperation({ summary: 'Block a user.' })
@ApiResponse({
  status: HttpStatus.OK,
  description:
    'User blocked successfully.',
})
public async blockUser(
  @Param('id', IsValidUUIDPipe) userId: string,
  @CurrentUser() user: User,
) {
  return await this.reportService.blockUser(user, userId);
}

@Post('unblock/:id')
@ApiOperation({ summary: 'Unblock a user.' })
@ApiResponse({
  status: HttpStatus.OK,
  description:
    'User unblock successfully.',
})
public async unblockUser(
  @Param('id', IsValidUUIDPipe) userId: string,
  @CurrentUser() user: User, 
) {
  return await this.reportService.unblockUser(user, userId);
}

@Get('blocked-users')
@ApiOperation({ summary: 'Get blocked user' })
@ApiResponse({
  status: HttpStatus.OK,
  description:
    'Data retrieve successfully.',
})
public async getBlockedUsers(@CurrentUser() user: User) {
  return await this.reportService.getBlockedUsers(user);
}




}