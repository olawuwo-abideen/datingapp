import { Body, Controller, Get, Param, Post } from '@nestjs/common';
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
}
