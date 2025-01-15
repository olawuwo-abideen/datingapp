import { Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from 'src/shared-module/decorators/current-user.decorator';
import { MatchService } from '../services/match.service';
import { User } from 'src/shared-module/entities/user.entity';
import { IsValidUUIDPipe } from 'src/shared-module/pipes/is-valid-uuid.pipe';


@Controller('match')
export class MatchController {

    constructor(private readonly matchService: MatchService) {}




    @Get()
    async discoverMatches(@CurrentUser() user: User) {
        return this.matchService.discoverMatches(user);
      }

      @Post('send/:id')
      async sendMatchRequest(
        @CurrentUser() sender: User, 
        @Param('id', IsValidUUIDPipe) receiverId: string) {
        return this.matchService.sendMatchRequest(sender, receiverId);
      }
    
      @Put('status/:id')
      async updateMatchStatus(
        @CurrentUser() user: User,
        @Param('id', IsValidUUIDPipe) matchId: string, 
        @Param('status') status: string) {
        return this.matchService.updateMatchStatus(user, matchId, status);
      }

}
