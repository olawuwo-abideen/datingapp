import { Test, TestingModule } from '@nestjs/testing';
import { MatchController } from './match.controller';
import { MatchService } from '../services/match.service';
import { User } from '../../../shared-module/entities/user.entity';

const mockMatchService = {
  discoverMatches: jest.fn(),
  sendMatchRequest: jest.fn(),
  updateMatchStatus: jest.fn(),
};

describe('MatchController', () => {
  let controller: MatchController;
  let matchService: MatchService;
  
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchController],
      providers: [
        {
          provide: MatchService,
          useValue: mockMatchService,
        },
      ],
    }).compile();

    controller = module.get<MatchController>(MatchController);
    matchService = module.get<MatchService>(MatchService);
  });

  describe('discoverMatches', () => {
    it('should return a list of matches', async () => {
      const user = new User();
      user.id = '1'; 
      
      const result = ['match1', 'match2']; 
      
      mockMatchService.discoverMatches.mockResolvedValue(result);

      const response = await controller.discoverMatches(user);

      expect(response).toBe(result);
      expect(mockMatchService.discoverMatches).toHaveBeenCalledWith(user);
    });
  });

  describe('sendMatchRequest', () => {
    it('should send a match request', async () => {
      const sender = new User();
      sender.id = '1';
      const receiverId = '2'; 

      const result = { message: 'Match request sent' }; 

      mockMatchService.sendMatchRequest.mockResolvedValue(result);

      const response = await controller.sendMatchRequest(sender, receiverId);

      expect(response).toBe(result);
      expect(mockMatchService.sendMatchRequest).toHaveBeenCalledWith(sender, receiverId);
    });
  });

  describe('updateMatchStatus', () => {
    it('should update the match status', async () => {
      const user = new User();
      user.id = '1'; 
      const matchId = '123'; 
      const status = 'accepted'; 

      const result = { message: 'Match status updated' }; 

      mockMatchService.updateMatchStatus.mockResolvedValue(result);

      const response = await controller.updateMatchStatus(user, matchId, status);

      expect(response).toBe(result);
      expect(mockMatchService.updateMatchStatus).toHaveBeenCalledWith(user, matchId, status);
    });
  });
});
