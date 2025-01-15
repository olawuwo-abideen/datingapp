import { Module } from '@nestjs/common';
import { MatchController } from './controllers/match.controller';
import { MatchService } from './services/match.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/shared-module/entities/user.entity';
import { Match } from 'src/shared-module/entities/match.entity';

@Module({
    imports: [
      TypeOrmModule.forFeature([User, Match]),

    ],
  controllers: [MatchController],
  providers: [MatchService]
})
export class MatchModule {}
