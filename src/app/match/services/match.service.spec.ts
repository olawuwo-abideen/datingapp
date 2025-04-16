// import { Test, TestingModule } from '@nestjs/testing';
// import { MatchService } from './match.service';

// describe('MatchService', () => {
//   let service: MatchService;

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [MatchService],
//     }).compile();

//     service = module.get<MatchService>(MatchService);
//   });

//   it('should be defined', () => {
//     expect(service).toBeDefined();
//   });
// });



import { Test, TestingModule } from '@nestjs/testing';
import { MatchService } from './match.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserStatus } from '../../../shared-module/entities/user.entity';
import { Match, MatchStatus } from '../../../shared-module/entities/match.entity';
import { NotFoundException } from '@nestjs/common';

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

describe('MatchService', () => {
  let service: MatchService;
  let userRepository: Repository<User>;
  let matchRepository: Repository<Match>;

  const mockUserRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockMatchRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MatchService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: getRepositoryToken(Match),
          useValue: mockMatchRepository,
        },
      ],
    }).compile();

    service = module.get<MatchService>(MatchService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    matchRepository = module.get<Repository<Match>>(getRepositoryToken(Match));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('discoverMatches', () => {
    it('should return message if user has no preferences', async () => {
      const user = { id: '1', preferences: null } as unknown as User;
      const result = await service.discoverMatches(user);
      expect(result).toEqual({
        message: 'No Match Found, Kindly edit your profile preference',
      });
    });

    it('should return matched users based on preferences', async () => {
      const user = {
        id: '1',
        preferences: {
          interestedIn: ['music'],
          ageRange: { min: 20, max: 30 },
          distance: 10,
        },
        location: { latitude: 0, longitude: 0 },
      } as User;

      const matchUser = {
        id: '2',
        preferences: {
          interestedIn: ['music'],
          ageRange: { min: 25, max: 35 },
        },
        userstatus: UserStatus.ACTIVE,
        location: { latitude: 0.01, longitude: 0.01 },
      } as User;

      mockUserRepository.find.mockResolvedValue([matchUser]);

      const matches = await service.discoverMatches(user);
      expect(matches).toHaveLength(1);
    });
  });

  describe('sendMatchRequest', () => {
    it('should throw if receiver is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);
      await expect(service.sendMatchRequest({ id: '1' } as User, '2')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if sender sends request to themselves', async () => {
      mockUserRepository.findOne.mockResolvedValue({ id: '1' });
      await expect(service.sendMatchRequest({ id: '1' } as User, '1')).rejects.toThrow(
        'Cannot send match request to yourself',
      );
    });

    it('should save and return a new match', async () => {
      const sender = { id: '1' } as User;
      const receiver = { id: '2' } as User;

      mockUserRepository.findOne.mockResolvedValue(receiver);
      mockMatchRepository.save.mockImplementation(match => Promise.resolve(match));

      const result = await service.sendMatchRequest(sender, '2');
      expect(result.sender).toBe(sender);
      expect(result.receiver).toBe(receiver);
      expect(result.status).toBe(MatchStatus.PENDING);
    });
  });

  describe('updateMatchStatus', () => {
    it('should throw if match not found', async () => {
      mockMatchRepository.findOne.mockResolvedValue(null);
      await expect(service.updateMatchStatus({ id: '1' } as User, 'match-id', 'accepted')).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw if user is not part of the match', async () => {
      const match = {
        id: 'match-id',
        sender: { id: '2' },
        receiver: { id: '3' },
      } as Match;

      mockMatchRepository.findOne.mockResolvedValue(match);
      await expect(service.updateMatchStatus({ id: '1' } as User, 'match-id', 'accepted')).rejects.toThrow(
        'You are not authorized to update this match status',
      );
    });

    it('should throw if invalid status is provided', async () => {
      const match = {
        id: 'match-id',
        sender: { id: '1' },
        receiver: { id: '2' },
      } as Match;

      mockMatchRepository.findOne.mockResolvedValue(match);
      await expect(service.updateMatchStatus({ id: '1' } as User, 'match-id', 'invalid')).rejects.toThrow(
        'Invalid match status',
      );
    });

    it('should update and return match with new status', async () => {
      const match = {
        id: 'match-id',
        sender: { id: '1' },
        receiver: { id: '2' },
        status: MatchStatus.PENDING,
      } as Match;

      mockMatchRepository.findOne.mockResolvedValue(match);
      mockMatchRepository.save.mockImplementation(m => Promise.resolve(m));

      const updated = await service.updateMatchStatus({ id: '1' } as User, 'match-id', MatchStatus.ACCEPTED);

      expect(updated.status).toBe(MatchStatus.ACCEPTED);
    });
  });
});
