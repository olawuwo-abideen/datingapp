import { Controller, Get } from '@nestjs/common';
import { CurrentUser } from 'src/shared-module/decorators/current-user.decorator';
import { User } from 'src/shared-module/entities/user.entity';
import { ReportService } from '../services/report.service';
@Controller('report')
export class ReportController {

    constructor(
        private readonly reportService:ReportService
        ){}
        



    @Get('')
    public async getUserReports(@CurrentUser() user: User) {
      return await this.reportService.getUserReports(user);
    }
}
