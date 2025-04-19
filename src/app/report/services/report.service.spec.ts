import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from './report.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Report } from '../../../shared-module/entities/report.entity';
import { User, UserStatus } from '../../../shared-module/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ReportDto } from '../dto/report.dto';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

const mockReportRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  remove: jest.fn(),
});

function createMockUser(overrides: Partial<User> = {}): User {
  return {
    id: 'user-123',
    email: 'mock@example.com',
    phone: '1234567890',
    userstatus: UserStatus.ACTIVE,
    profilevisibility: 'PUBLIC',
    preferences: {
      interestedIn: ['sports'],
      ageRange: { min: 20, max: 30 },
      distance: 10,
    },
    location: { latitude: 0, longitude: 0 },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as User;
}

describe('ReportService', () => {
  let service: ReportService;
  let userRepo: ReturnType<typeof mockUserRepository>;
  let reportRepo: ReturnType<typeof mockReportRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        { provide: getRepositoryToken(User), useFactory: mockUserRepository },
        { provide: getRepositoryToken(Report), useFactory: mockReportRepository },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    userRepo = module.get(getRepositoryToken(User));
    reportRepo = module.get(getRepositoryToken(Report));
  });

  afterEach(() => jest.clearAllMocks());

  describe('reportUser', () => {
    it('should create and return report data', async () => {
      const user = createMockUser();
      const reportedUser = createMockUser({ id: 'target-user' });
      const reportDto: ReportDto = {
        reason: 'Abuse',
        details: 'Harassed me in messages',
      };

      userRepo.findOne.mockResolvedValue(reportedUser);
      const mockReport = { id: 'rep-1', ...reportDto, userId: user.id, reportId: reportedUser.id };
      reportRepo.create.mockReturnValue(mockReport);
      reportRepo.save.mockResolvedValue(mockReport);

      const result = await service.reportUser(user, reportedUser.id, reportDto);

      expect(result.message).toBe('Report submitted successfully');
      expect(result.data.reportId).toBe(mockReport.id);
    });

    it('should throw NotFoundException if reported user does not exist', async () => {
      userRepo.findOne.mockResolvedValue(null);
      const user = createMockUser();

      await expect(
        service.reportUser(user, 'non-existent-id', { reason: 'Spam', details: 'Fake account' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserReports', () => {
    it('should return transformed user reports', async () => {
      const userId = 'user-123';
      const reports = [
        { id: 'r1', reason: 'Abuse', details: 'Test', reportId: 'u2', userId },
        { id: 'r2', reason: 'Spam', details: 'Test2', reportId: 'u3', userId },
      ];
      reportRepo.find.mockResolvedValue(reports);

      const result = await service.getUserReports(userId);
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(2);
    });

    it('should return message for no reports', async () => {
      reportRepo.find.mockResolvedValue([]);
      const result = await service.getUserReports('user-123');

      expect(result.message).toBe('No reports found for this user');
      expect(result.data).toHaveLength(0);
    });
  });

  describe('blockUser', () => {
    it('should block user successfully', async () => {
      const user = createMockUser();
      const targetUser = createMockUser({ id: 'target-456' });

      userRepo.findOne.mockResolvedValue(targetUser);
      reportRepo.findOne.mockResolvedValue(null);
      reportRepo.save.mockResolvedValue({});

      const result = await service.blockUser(user, targetUser.id);
      expect(result.message).toContain('has been blocked');
    });

    it('should throw if user tries to block themselves', async () => {
      const user = createMockUser();
      await expect(service.blockUser(user, user.id)).rejects.toThrow(BadRequestException);
    });

    it('should throw if user already blocked', async () => {
      const user = createMockUser();
      const targetUser = createMockUser({ id: 'target-456' });

      userRepo.findOne.mockResolvedValue(targetUser);
      reportRepo.findOne.mockResolvedValue({ id: 'existing-block' });

      await expect(service.blockUser(user, targetUser.id)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if target not found', async () => {
      const user = createMockUser();
      userRepo.findOne.mockResolvedValue(null);

      await expect(service.blockUser(user, 'target-123')).rejects.toThrow(NotFoundException);
    });
  });

  describe('unblockUser', () => {
    it('should unblock successfully', async () => {
      const user = createMockUser();
      const targetUser = createMockUser({ id: 'u456' });

      userRepo.findOne.mockResolvedValue(targetUser);
      reportRepo.findOne.mockResolvedValue({ id: 'block-id' });
      reportRepo.remove.mockResolvedValue({});

      const result = await service.unblockUser(user, targetUser.id);
      expect(result.message).toContain('has been unblocked');
    });

    it('should throw if not blocked', async () => {
      const user = createMockUser();
      const targetUser = createMockUser({ id: 'u456' });

      userRepo.findOne.mockResolvedValue(targetUser);
      reportRepo.findOne.mockResolvedValue(null);

      await expect(service.unblockUser(user, targetUser.id)).rejects.toThrow(BadRequestException);
    });
  });

  describe('getBlockedUsers', () => {
    it('should return blocked users', async () => {
      const user = createMockUser();
      const reports = [
        { blockedUserId: 'u1', userId: user.id },
        { blockedUserId: 'u2', userId: user.id },
      ];

      reportRepo.find.mockResolvedValue(reports);
      const result = await service.getBlockedUsers(user);
      expect(result.data).toHaveLength(2);
    });

    it('should return message if none are blocked', async () => {
      const user = createMockUser();
      reportRepo.find.mockResolvedValue([]);

      const result = await service.getBlockedUsers(user);
      expect(result.message).toBe('No users were blocked');
    });
  });
});
