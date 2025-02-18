import { Controller, Get, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { CurrentUser } from '../../../shared-module/decorators/current-user.decorator';
import { MatchService } from '../services/match.service';
import { User } from '../../../shared-module/entities/user.entity';
import { IsValidUUIDPipe } from '../../../shared-module/pipes/is-valid-uuid.pipe';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('match')
@Controller('match')
export class MatchController {
 constructor(private readonly matchService: MatchService) {}

    @Get()
      @ApiOperation({ summary: 'Get all match' })
      @ApiResponse({
        status: HttpStatus.OK,
        description:
          'Retrieve all user match',
      })
    async discoverMatches(@CurrentUser() user: User) {
        return this.matchService.discoverMatches(user);
      }

      @Post('send/:id')
      @ApiOperation({ summary: 'Send match request' })
      @ApiResponse({
        status: HttpStatus.OK,
        description:
          'Send match request',
      })
      async sendMatchRequest(
        @CurrentUser() sender: User, 
        @Param('id', IsValidUUIDPipe) receiverId: string) {
        return this.matchService.sendMatchRequest(sender, receiverId);
      }
    
      @Put('status/:id')
      @ApiOperation({ summary: 'Update match request' })
      @ApiResponse({
        status: HttpStatus.OK,
        description:
          'Update match request',
      })
      async updateMatchStatus(
        @CurrentUser() user: User,
        @Param('id', IsValidUUIDPipe) matchId: string, 
        @Param('status') status: string) {
        return this.matchService.updateMatchStatus(user, matchId, status);
      }

}
